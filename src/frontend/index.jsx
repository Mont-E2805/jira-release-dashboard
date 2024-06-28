import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text } from '@forge/react';
import { requestJira } from '@forge/bridge';
import { DynamicTable } from "@forge/react";
import { Link } from '@forge/react';
import api, { route } from '@forge/api';


const App = () => {

  //NOTE: you need to do a one-time replace the filter ID for your specific Jira instance
  const filterId = 10413 //BP Jira instance
  //const filterID = 10002 //Ellie's Test Jira instance

  const [data, setData] = useState();

  const createKey = (input) => {
    return input ? input.replace(/^(the|a|an)/, "").replace(/\s/g, "") : input;
  }

  //get data (used to be a resolver but moved to this main function)
  const getData = async () => {

    //get projects from Filter 
    const filter = await requestJira(`/rest/api/3/filter/${filterId}`, {
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
          currentVer: currentRelease.name,
          currentDate: currentRelease.releaseDate,
          currentDesc: currentRelease.description,
          nextVer: nextRelease.name,
          nextDate: nextRelease.releaseDate,
          nextDesc: nextRelease.description
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

  
  // Configs for the Tables
  
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
          key: "description",
          content: "Release Description",
          shouldTruncate: true,
          isSortable: true,
        },
      ],
    };

  //headings for the Next table
  const headNext = {
    cells: [
      {
        key: "service",
        content: "Service",
        isSortable: true,
      },
      {
        key: "version",
        content: "Next Scheduled Release",
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: "deployDate",
        content: "Scheduled Deployment Date",
        shouldTruncate: true,
        isSortable: true,
      },
      {
        key: "description",
        content: "Release Description",
        shouldTruncate: true,
        isSortable: true,
      },
    ],
  };
  

  // Rows for the tables 
  
  let rowsCurrent = [];
  let rowsNext = [];
  if (data != null) {
    /*
    rowsCurrent = {
      key: 'rows-current',
      cells: data
    }
      */
    console.log("print data for rows")
    console.log(data)

    rowsCurrent = data.map((d, index) => ({
      key: `row-${index}-${d.projectKey}`,
      cells: [
        {
          key: createKey(d.projectKey),
          content: <Link href={'/projects/' + d.projectKey + '?selectedItem=com.atlassian.jira.jira-projects-plugin%3Arelease-page'}>{d.projectKey}</Link>,
        },
        {
          key: createKey(d.currentVer),
          content: d.currentVer,
        },
        {
          key: createKey(d.currentDate),
          content: d.currentDate,
        },
        {
          key: createKey(d.currentDesc),
          content: d.currentDesc,
        },
      ],
    }));

    rowsNext = data.map((d, index) => ({
      key: `row-${index}-${d.projectKey}`,
      cells: [
        {
          key: createKey(d.projectKey),
          content: <Link href={'/projects/' + d.projectKey + '?selectedItem=com.atlassian.jira.jira-projects-plugin%3Arelease-page'}>{d.projectKey}</Link>,
        },
        {
          key: createKey(d.nextVer),
          content: d.nextVer,
        },
        {
          key: createKey(d.nextDate),
          content: d.nextDate,
        },
        {
          key: createKey(d.nextDesc),
          content: d.nextDesc,
        },
      ],
    }));

  }
  else {
    console.log("data is null")
    return (
      <>
        <Text>Welcome to the PEC Release Dashboard!</Text>

        <Text>Please wait while the data loads...</Text>
  
      </>
    );
  }

  return (
    <>
      <Text>Welcome to the PEC Release Dashboard!</Text>

      <DynamicTable
        caption="Current Production Versions"
			  head={headCurrent}
			  rows={rowsCurrent}
			  rowsPerPage={10}
			  defaultPage={1}
			  loadingSpinnerSize="large"
			  isRankable
		  />

      <DynamicTable
        caption="Next Scheduled Releases"
			  head={headNext}
			  rows={rowsNext}
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
