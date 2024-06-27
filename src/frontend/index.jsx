import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Text } from '@forge/react';
import { invoke } from '@forge/bridge';
import { DynamicTable } from "@forge/react";
import { Link } from '@forge/react';


const App = () => {


  const [data, setData] = useState(null);

  const tableData = async function () {
    const resp = await invoke('getReleaseData');
    console.log("response")
    console.log(resp)
    return resp;
  };
  console.log("resolved table data")
  console.log(tableData)


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
  const rowsCurrent = tableData.map((index, data) => ({
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
