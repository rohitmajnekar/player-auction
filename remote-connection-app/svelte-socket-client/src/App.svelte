<script>
import { Router, Route, Link } from "svelte-routing";
  // import Home from './Home.svelte';
  // import Details from './Details.svelte';
  import { getContext } from 'svelte';
  import Child from './Child.svelte';

</script>



<Router>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/details">Details</Link>
  </nav>

  <Route path="/" component={Child} />
  <!-- <Route path="/details" component={Details} /> -->
</Router>
