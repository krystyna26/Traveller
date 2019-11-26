import React from 'react';
import { render } from 'react-dom';

import { ApolloProvider } from '@apollo/react-hooks';

export default function App(){
  return(
    <div>
    <h1 id='root'>Main title</h1>
    </div>
  )
}

// const App = () => (
//   <ApolloProvider client={client}>
//     <div>
//       <h2>My first Apollo app 🚀</h2>
//     </div>
//   </ApolloProvider>
// );
//
// render(<App />, document.getElementById('root'));
