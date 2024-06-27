# Forge Jira Release Dashboard

This project contains a Forge app written in JavaScript that displays a release dashboard of the current and next releases in a Jira global page. This page 

See [developer.atlassian.com/platform/forge/](https://developer.atlassian.com/platform/forge) for documentation and tutorials explaining Forge.

## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start

- The `src/frontend/index.jsx` file contains the main app and frontend components.

- The `src/resolvers/index.js` file defines resolver functions that pull in data from the Jira API. See [Forge resolvers](https://developer.atlassian.com/platform/forge/runtime-reference/custom-ui-resolver/) for documentation on resolver functions.See [Jira REST API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#about) for documentation on the Rest API and direct examples of how to call it within Forge.

- Build and deploy your app by running:
```
forge deploy
```

- Install your app in an Atlassian site by running:
```
forge install
```

- Develop your app by running `forge tunnel` to proxy invocations locally:
```
forge tunnel
```

### Notes
- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.

## Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for how to get help and provide feedback.
