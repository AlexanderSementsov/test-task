import React, {useContext, useEffect} from "react";
import { navigate } from "gatsby";
import Layout from "../components/Layout";
import { AuthContext } from "../components/AuthProvider";

const Activation = () => {
  const { checkAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const isAuthenticated = checkAuthenticated();
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, []);

  return (
    <Layout>
      <div>
        <h1>Activation Page</h1>
      </div>
    </Layout>
  );
};

export default Activation;
