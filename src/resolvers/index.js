import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';

const resolver = new Resolver();


resolver.define('getReleaseData', async ({ payload, context }) => {

  //get projects from Filter 
  //NOTE: you need to doe a one-time replace the filter ID for your specific Jira instance
  const filter = await api.asUser().requestJira(route`/rest/api/3/filter/10002`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  const data = await filter.json();
  const filterJQL = await data.jql

  let filterParts = filterJQL.split('(')
  filterParts = filterParts[1].split(')')
  filterParts = filterParts[0].split(",")
  const projects = filterParts.map( s => s.trim())
  // projects is an array of project Keys from the filter 
  console.log(projects)

  //variable to hold the final table data 
  let tableData = new Map(); 
  let i = 1;

  //loop through projects to get releases
  for (const p in projects) {
    let project = projects[p]
    
  //projects.forEach(async function (project) {
    const releases = await api.asUser().requestJira(route`/rest/api/3/project/${project}/version?orderBy=-releaseDate&maxResults=20`, {
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
      tableData.set(i, object);
      i++; 
      console.log(i)
      console.log(object)
    }

  }

  console.log("FINAL table Data Print")
  console.log(Object.prototype.toString.call(tableData))
  console.log(tableData)

  return tableData;
});




export const handler = resolver.getDefinitions();
