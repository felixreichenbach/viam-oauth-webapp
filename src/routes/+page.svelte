<script lang="ts">
    // tag::clientIdSecret[]
    // set in the environment or directly
    const clientId = import.meta.env.VITE_CLIENT_ID; // process.env.CLIENT_ID; // or set directly
    //const clientSecret = import.meta.env.VITE_CLIENT_SECRET; //process.env.CLIENT_SECRET; // or set directly
    // end::clientIdSecret[]
  
    // tag::baseURL[]
    const fusionAuthBaseURL = import.meta.env.VITE_BASE_URL;
    // end::baseURL[]
  
    import pkceChallenge from "pkce-challenge";
  
    // NEW CODE
    const stateValue =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  
    let href = "";
  
    async function constructFusionAuthURL() {
      const pkce_pair = await pkceChallenge();
      const challenge = pkce_pair.code_challenge;
      const port = 3000;
      return `${fusionAuthBaseURL}/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=http://localhost:${port}/oauth-redirect&scope=offline_access&state=${stateValue}&code_challenge=${challenge}&code_challenge_method=S256`;
    }
  
    $: (async () => {
      href = await constructFusionAuthURL();
    })();
  </script>
  
  <h1>Welcome to Viam OAuth</h1>
  <a {href}>Login</a>
  