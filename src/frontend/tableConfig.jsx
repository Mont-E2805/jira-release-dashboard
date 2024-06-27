import { presidents } from "../resolvers/testData.js";
import React, { useEffect, useState } from 'react';
import { Link } from '@forge/react';
import {tableData} from "../resolvers/index.js"
import { route } from '@forge/api';

const createKey = (input) => {
  return input ? input.replace(/^(the|a|an)/, "").replace(/\s/g, "") : input;
}

// Config for the "current version" Table 

//headings for the current table
export const headCurrent = {
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
export const rowsCurrent = tableData.map((data, index) => ({
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