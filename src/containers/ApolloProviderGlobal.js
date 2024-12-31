import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  from,
  ApolloLink,
  Observable,
} from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { setContext } from "@apollo/client/link/context";
import { Modal } from "antd";
import { onError } from "@apollo/client/link/error";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
const isPaused = true;
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message }) => {
      if (message === "Unauthorized") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return <Navigate to="/login" replace />;
      } else {
        Modal.error({
          title: "",
          content: `${message}`,
        });
      }
    });
  if (networkError)
    Modal.error({
      title: "",
      content: `${networkError}`,
    });
});
// Custom Apollo Link to handle pausing
const pauseLink = new ApolloLink((operation, forward) => {
  if (isPaused) {
    // Prevent requests from forwarding until unpaused
    return new Observable((observer) => {
      const interval = setInterval(() => {
        if (!isPaused) {
          clearInterval(interval);
          forward(operation).subscribe(observer); // Resume request
        }
      }, 100); // Poll every 100ms
    });
  }

  return forward(operation);
});
const httpLink = createUploadLink({
  uri:
    // eslint-disable-next-line no-undef
    (process.env.REACT_APP_API_HOST ?? "http://localhost:3002/") + "graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      "Apollo-Require-Preflight": "true",
    },
  };
});

const client = new ApolloClient({
  link: from([pauseLink, errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});

const ApolloProviderGlobal = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

ApolloProviderGlobal.propTypes = {
  children: PropTypes.node,
};

export default ApolloProviderGlobal;
