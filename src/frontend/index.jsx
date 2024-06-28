import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text } from '@forge/react';
import { requestJira } from '@forge/bridge';
import { DynamicTable } from "@forge/react";
import { Link } from '@forge/react';
import api, { route } from '@forge/api';


const App = () => {

  const [data, setData] = useState();

  const createKey = (input) => {
    return input ? input.replace(/^(the|a|an)/, "").replace(/\s/g, "") : input;
  }

  //get data (used to be a resolver but moved to this main function)
  const getData = async () => {

    //get projects from Filter 
    //NOTE: you need to doe a one-time replace the filter ID for your specific Jira instance
    const filter = await requestJira(`/rest/api/3/filter/10002`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    const data1 = await filter.json();
    const filterJQL = await data1.jql
  
    let filterParts = filterJQL.split('(')
    filterParts = filterParts[1].split(')')
    filterParts = filterParts[0].split(",")
    const projects = filterParts.map( s => s.trim())
    // projects is an array of project Keys from the filter 
    console.log(projects)
  
    //variable to hold the final table data 
    let tableData = new Array(); 
    let i = 1;
  
    //loop through projects to get releases
    for (const p in projects) {
      let project = projects[p]
      
    //projects.forEach(async function (project) {
      const releases = await requestJira(`/rest/api/3/project/${project}/version?orderBy=-releaseDate&maxResults=20`, {
        headers: {
          'Accept': 'application/json'
        }
      });
  
      // releases returned are sorted by release date from future -> past 
  
      const releasesJson = await releases.json()
      const releasesList = await releasesJson.values
  
      //variable for the current live version 
      let currentRelease;
      //variable for released true count 
      let releaseTrue = 0;
      //variable for next release 
      let nextRelease;
  
      //loop through the releases in a project 
      releasesList.forEach(function (release) {
        //find the most recent released version - aka the current live version
        if (release.released & releaseTrue == 0) {
          currentRelease = release;
          releaseTrue += 1
        }
        //find the next unreleased version (works because the list is sorted)
        else if (!release.released) {
          nextRelease = release 
        }
        
      }) 
    
      if (currentRelease == null || nextRelease == null) {
        console.log("NOTE: One of the releases is null, skipping this project")
        console.log("current release")
        console.log(currentRelease)
        console.log("next release")
        console.log(nextRelease)
      }
      else {
        //create object for table array 
        const object = {
          projectKey: project,
          currenVer: currentRelease.name,
          currentDate: currentRelease.releaseDate,
          nextVer: nextRelease.name,
          nextDate: nextRelease.releaseDate
          //TODO: add release notes
        }
  
        //add to table data array 
        tableData.push(object);
        i++; 
        console.log(i)
        console.log(object)
      }
  
    }
  
    console.log("FINAL table Data Print")
    console.log(Object.prototype.toString.call(tableData))
    console.log("tableData:  " + tableData)

    console.log("end getData")
  
    return tableData;
  }

  useEffect(() => {
    console.log("useEffect start")
    getData().then(setData)
    console.log("data in useEffect")
  }, []);

  
  // Config for the "current version" Table 
  
  //headings for the current table
  const headCurrent = {
      cells: [
        {
          key: "service",
          content: "Service",
          isSortable: true,
        },
        {
          key: "version",
          content: "Currently Live Version",
          shouldTruncate: true,
          isSortable: true,
        },
        {
          key: "deployDate",
          content: "Deployment Date",
          shouldTruncate: true,
          isSortable: true,
        },
        {
          key: "releaseNote",
          content: "Release Notes",
          shouldTruncate: true,
          isSortable: true,
        },
      ],
    };
  
  // applied as rows in the current table
  
  let rowsCurrent = [];
  if (data != null) {
    /*
    rowsCurrent = {
      key: 'rows-current',
      cells: data
    }
      */
    
    rowsCurrent = data.map((index, data) => ({
      key: `row-${index}-${data.projectKey}`,
      cells: [
        {
          key: createKey(data.projectKey),
          content: <Link href="">{data.projectKey}</Link>,
        },
        {
          key: createKey(data.currenVer),
          content: data.currenVer,
        },
        {
          key: createKey(data.currenVerDate),
          content: data.currenDate,
       },
      ],
    }));
    
    console.log("rowsCurrent:   " + rowsCurrent)
    console.log(Object.prototype.toString.call(rowsCurrent))
    console.log(rowsCurrent)

  }
  else {
    console.log("data is null - else rowsCurrent")
    return (
      <>
        <Text>Hello world!</Text>
  
        <DynamicTable
          head={headCurrent}
          emptyView="No data to display"
          //rows={rowsCurrent}
          rowsPerPage={10}
          defaultPage={1}
          loadingSpinnerSize="large"
          isRankable
        />
      </>
    );
  }

  return (
    <>
      <Text>Hello world!</Text>

      <DynamicTable
			  head={headCurrent}
        //emptyView="No data to display"
			  rows={rowsCurrent}
			  rowsPerPage={10}
			  defaultPage={1}
			  loadingSpinnerSize="large"
			  isRankable
		  />
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
