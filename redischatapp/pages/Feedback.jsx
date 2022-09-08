import { useEffect, useState } from "react";
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
//Importing Compoents
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import ListContainer from '../Components/Home/ListContainer';

function Feedback() {
  const [isSSR, setIsSSR] = useState(false);

  const [listingList, setListingList] = useState([]);

  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loggedInUserData, setLoggedInUserData] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    fetchDataFromAPIGET();

    fetchDataFromAPIGETOfUsers();

    // setLoggedInUserData(loggedUserData);
  }, []);

  function fetchDataFromAPIGET() {
    if (typeof window !== "undefined") {
      (async () => {
        const response = await fetch('http://localhost:8000/listing', {
          method: 'GET',
          headers: {
            accept: 'application/json',
          }
        });
        const content = await response.json();
        setListingList(content);
      })();
    }
  }

  function fetchDataFromAPIGETOfUsers() {
    if (typeof window !== "undefined") {
      (async () => {
        const response = await fetch('http://localhost:8000/user/', {
          method: 'GET',
          headers: {
            accept: 'application/json',
          }
        });
        const content = await response.json();
        setUserData(content);
      })();
    }
  }

  function getLoggedInUserData() {
    console.log("user data: ", userData);
    if (userData !== null) {
      for (let i = 0; i < userData.length; i++) {
        if (userData[i].isSignedIn === true) {
          console.log("userData Specific is equal to : ", userData[i]);
          // setLoggedInUserData(userData[i]);
          return userData[i];
        }
      }
    }
    else {
      console.log("userData is null");
    }
  }

  useEffect(() => {
    console.log(`The Listing Data is equal to : `, listingList);
    console.log('The User Data is equal to : ', userData);
    console.log('The Logged In User Data is equal to : ', loggedUserData);

    if (typeof window !== "undefined") {
      setIsSSR(true);
    }
    else {
      setIsSSR(false);
    }

    console.log("The signedIn User is equal to :-=-=-=-=-=-= OBJ=> ", getLoggedInUserData("loggedInUserData"));

    //Getting user data from local storage
    if (typeof window !== "undefined" && isSignedIn == false && localStorage.getItem('signedInUserId') !== null) {
      setIsSignedIn(true);
    }
    else {
      console.log("User is not signed in yet Nor is there a user in local storage");
    }
    //Getting user data from local storage
  })

  let loggedUserData = null;
  loggedUserData = getLoggedInUserData();
  console.log("loggedUserData : ", loggedUserData);

  return (
    <div>
      <Head>
        <title>RealtimeChatApp</title>
      </Head>

      <Header />

      <div className={`container`}>
        <div className={`row`}>
          <div className={`col-12`}>
            <br /><br /><br />
            <h3 className='text-center text-dark mt-4'>NextJS & Redis Based ChatApplication Feedback | Home</h3>
            <h5 className="text-info text-center">Here you can let me know about your feedback about project</h5>
            <br />

            <div className='listContainer'>
              {(isSSR) ? (
                <>
                  {(localStorage.getItem('loggedInUserData') !== null || isSignedIn !== false) ? (
                    <div>
                      <h4 className='text-center text-dark mt-4'>Welcome {JSON.parse(localStorage.getItem('loggedInUserData')).name}! You are logged In</h4>

                      <div className="text-center mb-4 mt-4">
                        <button className='btn btn-danger'
                          onClick={() => {
                            localStorage.removeItem('loggedInUserData');
                            setIsSignedIn(false);
                            window.location.reload();
                            alert("You are logged out Successfully!");
                            // setLoggedInUserData(null);
                            // Router.push('/');
                          }}
                        >
                          Logout
                        </button>
                      </div>

                      {(listingList.length > 0) ? (
                        <>
                          <h3 className="text-success text-center">Showing Public and Private both</h3>
                          <br />
                          <div className='text-center'>
                            {
                              listingList.map((item, index) => {
                                return (
                                  <div className="containerListing" key={index}>
                                    <ListContainer
                                      index={index}

                                      //VALUES
                                      id={item.id}
                                      title={item.title}
                                      isPublic={item.isPublic}
                                      category={item.category}
                                      description={item.description}
                                      userWhoCreated={item.userWhoCreated}
                                      timeCreated={item.timeCreated}

                                      //OTER Important Props
                                      userWhoCommented={JSON.parse(localStorage.getItem('loggedInUserData')).name}
                                      //FUNCTIONS
                                      listingList={listingList}
                                      setListingList={setListingList}
                                    // userData={userData}
                                    />
                                  </div>
                                )
                              })
                            }
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 className="text-success text-center">No Public or Private Feedback Found. You can add one here <a href="/AddFeedback">Add Feedback</a></h3>
                        </>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="text-center">
                        <h4 className='text-center text-dark mt-4'>Welcome Anonymous User! You are not logged In</h4>
                        <Link href="/Login">Login Now</Link>
                      </div>
                      <br />
                      {(listingList.length > 0) ? (
                        <>
                          <h3 className="text-warning text-center">Showing Public Feedbacks Only</h3>
                          {
                            listingList.map((item, index) => {
                              return (
                                <div key={index}>
                                  {(item.isPublic === true) ? (
                                    <div className="containerListing">
                                      <ListContainer
                                        index={index}

                                        //VALUES
                                        id={item.id}
                                        title={item.title}
                                        isPublic={item.isPublic}
                                        category={item.category}
                                        description={item.description}
                                        userWhoCreated={item.userWhoCreated}
                                        timeCreated={item.timeCreated}

                                        //OTER Important Props
                                        userWhoCommented={null}
                                      //FUNCTIONS
                                      // listingList={listingList}
                                      // setListingList={setListingList}
                                      // userData={userData}
                                      />
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              )
                            })
                          }
                        </>
                      ) : (
                        <>
                          <h3 className="text-warning text-center">No Public Feedback Found. You can add one here <a href="/AddFeedback">Add Feedback</a></h3>
                        </>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <h3>Login Page Window is undefined</h3>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <br /><br /><br /><br /> */}
      <Footer />
    </div>
  )
}
export default Feedback;