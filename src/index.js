import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {store} from './appInit/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.scss';
import {LinksApp} from "./Components/LinksApp";
import {ApolloClient, InMemoryCache, ApolloProvider, gql} from '@apollo/client';

const container = document.getElementById('root');
const root = createRoot(container);

const client = new ApolloClient({
    //'http://test-task.profilancegroup-tech.com/graphql'
    //'https://flyby-gateway.herokuapp.com/'
    uri: 'http://test-task.profilancegroup-tech.com/graphql',
    cache: new InMemoryCache(),
});

root.render(
    <ApolloProvider client={client}>
        <LinksApp/>
    </ApolloProvider>
    /*<React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>*/
);

// If you want to start measuring performance in your appInit, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
