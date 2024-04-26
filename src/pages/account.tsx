import React, { useContext, useState, useEffect } from "react";
import { navigate } from "gatsby";
import Layout from "../components/Layout";
import { AuthContext } from "../components/AuthProvider";
import { updateAccountInfo, fetchAccountInfo } from "../services/api";
import '../styles/Account.css';

const Account = () => {
  const { checkAuthenticated, token } = useContext(AuthContext);
  const [accountId, setAccountId] = useState("");
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ownerAddress, setOwnerAddress] = useState("");

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAccountInfo(accountId);
      setAccountInfo(data);
      setOwnerAddress(data.ownerAddress);
    } catch (error) {
      setError(error.message);
      console.error("Error occurred:", error);
      if (error.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      setLoading(true);
      setError(null);
      await updateAccountInfo(accountId, { ownerAddress }, token);
      await handleSearch();
    } catch (error) {
      setError(error.message);
      console.error("Error occurred:", error);
      if (error.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isAuthenticated = checkAuthenticated();
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, []);

  return (
    <Layout>
      <div className="account-container">
        <h1>Account Page</h1>
        <div className="search-section">
          <input
            type="text"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            placeholder="Enter Account ID"
          />
          <button onClick={handleSearch} disabled={loading}>
            Search
          </button>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">Error: {error}</p>}
        {accountInfo && (
          <div>
            <h2>Account Info</h2>
            <div className="account-properties">
              <p>Owner first name: {accountInfo.ownerFirstName}</p>
              <p>Owner last name: {accountInfo.ownerLastName}</p>
              <p>Owner address: {accountInfo.ownerAddress}</p>
              <p>Date account created: {accountInfo.dateCreated}</p>
              <p>Paid/Free account flag: {accountInfo.paid ? "Paid" : "Free"}</p>
            </div>
            <div className="edit-section">
              <input
                type="text"
                value={ownerAddress}
                onChange={(e) => setOwnerAddress(e.target.value)}
                placeholder="Enter New Owner Address"
              />
              <button onClick={handleEdit} disabled={loading}>
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Account;
