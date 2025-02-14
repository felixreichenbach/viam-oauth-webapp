# Viam Svelte OAuth Web Application Starter Kit

This basic Svelte web application is supposed to help you quickly build a frontend application allowing you to use OAuth for identification for accessing Viam machine and cloud APIs.

# Svelte Application

New to Svelte?

Start here:

1. [Svelte Introduction](https://svelte.dev/docs/kit/introduction)
2. [Great Svelte Data Flow Video](https://youtu.be/j3aliHghr3E))

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

# Viam OAuth

New to Viam OAuth?

Start here: [Viam OAuth](https://docs.viam.com/manage/manage/oauth/)

## Useful Viam OAuth CLI Commands

Create Viam OAuth Application:

```bash
viam organization auth-service oauth-app create \
--org-id=<VIAM ORG ID> \
--client-name="Viam OAuth Template App" \
--client-authentication=required \
--enabled-grants="password, authorization_code" \
--logout-uri="http://localhost:5173/logout" \
--origin-uris="http://localhost:5173" \
--redirect-uris="http://localhost:5173/callback" \
--pkce=not_required \
--url-validation=allow_wildcards
```

> **Note:** Make sure to store the received credentials `Client ID` and `Client Secret` securely!

Update Viam OAuth Application:

```bash
viam organization auth-service oauth-app update \
--org-id=<VIAM ORG ID> \
--client-id=<VIAM OAUTH CLIENT ID> \
--<KEY>=<VALUE TO UPDATE>
```

Read Existing OAuth Application:

```bash
viam organization auth-service oauth-app read \
--org-id=<VIAM ORG ID> \
--client-id=<VIAM OAUTH CLIENT ID>
```
