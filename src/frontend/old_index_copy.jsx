import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text } from '@forge/react';
import { invoke } from '@forge/bridge';
import { DynamicTable } from "@forge/react";
import { Link } from '@forge/react';


const App = () => {


  const [data, setData] = useState();

/*
  const fetchTableData = (async function() {
    const resp =  await (await invoke('getReleaseData'));
    console.log(Object.prototype.toString.call(resp))
    console.log(resp);
    console.log("response returned by fetchTableData")
    console.log(resp.data)
    return resp.data;
  });
  
  useEffect(() => {
    fetchTableData().then(newTableData => {
      const x = setTableData(newTableData);
      console.log("new table data")
      console.log(Object.prototype.toString.call(newTableData))
      console.log(newTableData)
      console.log("resolved table data in useEffect")
      console.log(Object.prototype.toString.call(tableData))
      console.log(tableData)
      return x;
    });
  }, []);
  */

  /*
  let fetchData = (async function() {
    const resp = await (await invoke('getReleaseData'));
    console.log("resp")
    console.log(resp);
    return resp;
  });
  */

  useEffect(() => {
    let x;
    console.log("useEffect start")
    invoke('getReleaseData').then(x)
    console.log("x")
    console.log(x)
    setData(x);
    console.log("resolved table data in useEffect")
    console.log(Object.prototype.toString.call(data))
    console.log(data)
  }, []);




  const createKey = (input) => {
    return input ? input.replace(/^(the|a|an)/, "").replace(/\s/g, "") : input;
  }
  
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
  let rowsCurrent;
  if (data != null) {
    rowsCurrent = data;
    //rowsCurrent = tableData.map((index, data) => ({
    //  key: `row-${index}-${data.projectKey}`,
    //  cells: [
    //    {
    //      key: createKey(data.projectKey),
    //      content: <Link href="">{data.projectKey}</Link>,
    //    },
    //    {
    //      key: createKey(data.currenVer),
    //      content: data.currenVer,
    //    },
   //     {
    //      key: createKey(data.currenVerDate),
    //      content: data.currenDate,
   //    },
    //  ],
   // }));
    console.log(rowsCurrent)
  }
  else {
    rowsCurrent = rowsCurrent;
    console.log("else rowsCurrent")
    console.log(rowsCurrent)
  }

  return (
    <>
      <Text>Hello world!</Text>

      <DynamicTable
			  head={headCurrent}
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
