import { Avatar, Button } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import { Box, Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import background from "../assets/backgroundREG.png";
import { RankModel } from "../model/rankModel";
import { Usermodel } from "../model/usermode";
import { getRankImageall } from "../service/GetService";
import "./RankCircle.css";

// import Slider from "@mui/material/Slider/Slider";
function MainPage() {
  const [rankImage, setRankImage] = useState<RankModel[]>([]);
  const [userdata, setuserdata] = useState<Usermodel>();
  const history = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const data: RankModel[] = await getRankImageall();

      setRankImage(data); // Update the type of setRankImage to accept a single ListRankImage object
    };

    const userdata = localStorage.getItem("user_WEBAVD");
    let user;

    if (userdata !== null) {
      user = JSON.parse(userdata);
      setuserdata(user);
    } else {
      // Handle the case when userdata is null
      // For example, you might want to set user to an empty object
      user = {};
    }

    // const userdata = localStorage.getItem("user_WEBAVD");
    // const user = JSON.parse(userdata);
    // console.log(user);

    // setuserdata(user);
    fetchData();
  }, []);
  const location = useLocation();

  //   const Item = styled(Paper)(({ theme }) => ({
  //     backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  //     ...theme.typography.body2,
  //     padding: theme.spacing(1),
  //     textAlign: "center",
  //     color: theme.palette.text.secondary,
  //   }));

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    flexGrow: 1,
  }));

  //   const RankCircle = ({
  //     rank,
  //     username,
  //     point,
  //   }: {
  //     rank: number;
  //     username: string;
  //     point: number;
  //   }) => (
  //     <div style={{ display: "flex", padding: 5 }}>
  //       <div className="rank-circle">{rank}</div>
  //       <div
  //         style={{
  //           display: "flex",
  //           justifyContent: "space-between",
  //           width: "100%",
  //         }}
  //       >
  //         <div className="username">{username}</div>
  //         <div className="point">
  //           <div style={{ margin: 0 }}>
  //             <p style={{ margin: 0, fontSize: "10px" }}>Point</p>
  //             <p style={{ margin: 0 }}>{point}</p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );

  const RankCircle = ({
    rank,
    username,
    point,
    color,
    colortext,
    change_rank,
  }: {
    rank: number;
    username: string;
    point: number;
    color: string;
    colortext: string;
    change_rank: number;
  }) => (
    <div style={{ margin: 0 }}>
      <div style={{ display: "flex", padding: 5 }}>
        <div
          className="rank-circle"
          style={{ backgroundColor: color, color: colortext }}
        >
          <p>{rank}</p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div className="username" style={{ margin: 0 }}>
            <div
              style={{
                margin: 0,
                marginRight: 10,
                marginLeft: -6,
                marginTop: 15,
              }}
            >
              {change_rank > 0 ? (
                <p
                  style={{
                    color: "green",
                    fontFamily: "Kanit",
                    fontSize: "12px",
                    margin: 0,
                    backgroundColor: "white",
                    borderRadius: "100%",
                    width: "16px",
                    height: "16px",
                    textAlign: "center",
                    strokeWidth: "1px",
                    border: "1px solid green",
                  }}
                >
                  +{change_rank}
                </p>
              ) : change_rank < 0 ? (
                <p
                  style={{
                    color: "red",
                    fontFamily: "Kanit",
                    fontSize: "12px",
                    margin: 0,
                    backgroundColor: "white",
                    borderRadius: "100%",
                    width: "16px",
                    height: "16px",
                    textAlign: "center",
                    strokeWidth: "1px",
                    border: "1px solid red",
                  }}
                >
                  {change_rank}
                </p>
              ) : (
                ""
              )}
            </div>
            {username}
          </div>
          <div className="point">
            <div style={{ margin: 0 }}>
              <p style={{ margin: 0, fontSize: "10px" }}>Point</p>
              <p style={{ margin: 0 }}>{point}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const showrank = () => {
    return (
      <div style={{ overflow: "auto", paddingBottom: 5 }}>
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", margin: 0 }}>
            <p className="textRanking">Ranking</p>
            <img
              src="https://www.pikpng.com/pngl/b/20-200957_izuku-midoriya-two-heroes-boku-no-hero-academia.png"
              alt=""
              width={80}
            />
          </Box>

          <ImageList
            sx={{
              height: "80vh",
              display: "flex",
              flexWrap: "wrap",
              "&::-webkit-scrollbar": {
                width: "5px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#FCFCFC",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#BBBBBB",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#BBBBBB",
              },
            }}
          >
            {rankImage.slice(0, 10).map((user, index) => {
              return (
                <Box
                  key={user.id}
                  sx={{
                    flex: index < 2 ? "2 0 40%" : "0 0 30%",
                    padding: 0.5,
                    position: "relative",
                    "&:hover .image-overlay": {
                      // เพิ่ม class เพื่อการควบคุม hover
                      opacity: 1,
                      transition: "opacity 0.3s ease-in-out",
                    },
                  }}
                >
                  <Item
                    sx={{
                      borderRadius: "30px",
                      padding: 1,
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(0.9)",
                      },
                    }}
                  >
                    <RankCircle
                      rank={user.rank}
                      username={user.username}
                      point={user.votes}
                      change_rank={user.rank_yesterday - user.rank}
                      color={
                        index === 0
                          ? "#00A9FF"
                          : index === 1
                          ? "#89CFF3"
                          : index === 2
                          ? "#A0E9FF"
                          : "#BBBBBB"
                      }
                      colortext={
                        index === 0
                          ? "#FFFFFF"
                          : index === 1
                          ? "#FFFFFF"
                          : index === 2
                          ? "#000000"
                          : "#000000"
                      }
                    />

                    <img
                      src={user.image_url}
                      alt={`Profile for ${user.id}`}
                      loading="lazy"
                      width={"100%"}
                      style={{ borderRadius: "30px" }}
                    />
                    <Box
                      className="image-overlay"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        opacity: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "30px",
                        "&:hover": {
                          cursor: "pointer",
                        },
                      }}
                    >
                      <button
                        style={{
                          margin: "10px",
                          backgroundColor: "#FFBF00",
                          color: "black",
                          borderRadius: "10px",
                          width: "120px",
                          height: "30px",
                          fontSize: "15px",
                          fontFamily: "Kanit",
                        }}
                        onClick={() => handleClickOpen(user.user_id)}
                      >
                        View Profile
                      </button>
                    </Box>
                  </Item>
                </Box>
              );
            })}
          </ImageList>
        </Box>
      </div>
    );
  };

  const handleClickOpen = (id: number) => {
    localStorage.setItem("prevPath", location.pathname);
    history(`/profileview/${id}`);
  };

  const profile = () => {
    return (
      <Box sx={{ paddingRight: 3 }}>
        <Item
          sx={{
            borderRadius: "30px",
            height: "35vh",
            marginTop: "110px",
            padding: 2,
            display: "flex",
            flexDirection: "column", // ตั้งค่าให้เนื้อหาภายในเรียงจากบนลงล่าง
            justifyContent: "space-between", // ทำให้ p อยู่ด้านบนและ Item อยู่ด้านล่าง
          }}
        >
          <p className="textProfile">Profile</p>
          {userdata ? (
            <Link
              to="/profile"
              style={{
                width: "100%",
                height: "100%",
                maxHeight: "100%",
                minHeight: "100%",
                margin: 0,
                padding: 0,
                textDecoration: "none",
              }}
            >
              <Item
                sx={{
                  backgroundColor: "#F1F1F1",
                  borderRadius: "30px",
                  display: "flex", // Enable flex layout
                  flexDirection: "column", // Stack children vertically
                  alignItems: "center", // Center-align children horizontally
                  justifyContent: "center", // Center-align children vertically
                  height: "80%", // Adjust the height as needed
                  padding: 1,
                  overflow: "hidden", // Prevent overflow of children outside the border-radius
                  textAlign: "center", // Center the text
                  transition: "transform 0.3s ease-in-out", // Add this line
                  "&:hover": {
                    // Add this block
                    transform: "scale(0.9)", // Change the scale to your preference
                  },
                }}
              >
                <Avatar
                  alt="User Profile"
                  src={userdata?.image_profile}
                  sx={{
                    width: (theme) => theme.spacing(20), // Use a fixed size for width
                    height: (theme) => theme.spacing(20), // Use a fixed size for height to match the width
                    borderRadius: "50%", // This will make it a circle
                    maxWidth: "100%", // Ensure the avatar doesn't exceed the container's width
                    maxHeight: "100%", // Ensure the avatar doesn't exceed the container's height
                    objectFit: "cover", // Cover the area without distorting the aspect ratio
                    marginY: 2, // Optional: Add some vertical margin if needed
                  }}
                />

                <p
                  style={{
                    fontFamily: "Kanit",
                    fontSize: "20px",
                    margin: 0, // Remove margin to stick to the bottom
                  }}
                >
                  {userdata?.aka}
                </p>
              </Item>
            </Link>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                maxHeight: "100%",
                minHeight: "100%",
                margin: 0,
                padding: 0,
              }}
            >
              <Link
                to="/login"
                style={{
                  width: "100%",
                  height: "50%",
                  maxHeight: "50%",
                  minHeight: "50%",
                  margin: 0,
                  padding: 1,
                  textDecoration: "none",
                }}
              >
                <Item
                  sx={{
                    backgroundColor: "#F1F1F1",
                    borderRadius: "30px",
                    display: "flex", // Enable flex layout
                    flexDirection: "column", // Stack children vertically
                    alignItems: "center", // Center-align children horizontally
                    justifyContent: "center", // Center-align children vertically
                    height: "30%", // Adjust the height as needed
                    padding: 1,
                    overflow: "hidden", // Prevent overflow of children outside the border-radius
                    textAlign: "center", // Center the text
                    transition: "transform 0.3s ease-in-out", // Add this line
                    "&:hover": {
                      // Add this block
                      transform: "scale(0.9)", // Change the scale to your preference
                    },
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Kanit",
                      fontSize: "20px",
                      margin: 0,
                    }}
                  >
                    Login
                  </p>
                </Item>
                <Link
                  to="/reg"
                  style={{
                    width: "100%",
                    height: "50%",
                    maxHeight: "50%",
                    minHeight: "50%",
                    margin: 0,
                    padding: 1,
                    textDecoration: "none",
                  }}
                >
                  <Item
                    sx={{
                      backgroundColor: "#F1F1F1",
                      borderRadius: "30px",
                      display: "flex", // Enable flex layout
                      flexDirection: "column", // Stack children vertically
                      alignItems: "center", // Center-align children horizontally
                      justifyContent: "center", // Center-align children vertically
                      height: "30%", // Adjust the height as needed
                      padding: 1,
                      overflow: "hidden", // Prevent overflow of children outside the border-radius
                      textAlign: "center", // Center the text
                      transition: "transform 0.3s ease-in-out", // Add this line
                      "&:hover": {
                        // Add this block
                        transform: "scale(0.9)", // Change the scale to your preference
                      },
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Kanit",
                        fontSize: "20px",
                        margin: 0,
                      }}
                    >
                      Sign up
                    </p>
                  </Item>
                </Link>
              </Link>
            </Box>
          )}
        </Item>
      </Box>
    );
  };

  const Vote = () => {
    return (
      <Box sx={{ paddingRight: 3 }}>
        <Item
          sx={{
            borderRadius: "30px",
            height: "35vh",
            // marginTop: "110px",
            padding: 2,
          }}
        >
          <p className="textProfile">Vote</p>
          {userdata ? (
            <Link
              to="/vote"
              style={{
                width: "100%",
                height: "100%",
                maxHeight: "100%",
                minHeight: "100%",
                margin: 0,
                padding: 0,
                textDecoration: "none",
              }}
            >
              <Item
                sx={{
                  backgroundColor: "#F1F1F1",
                  borderRadius: "30px",
                  display: "flex", // Enable flex layout

                  alignItems: "center", // Center-align children horizontally
                  justifyContent: "center", // Center-align children vertically
                  height: "80%", // Adjust the height as needed
                  padding: 1,
                  overflow: "hidden", // Prevent overflow of children outside the border-radius
                  textAlign: "center", // Center the text
                  transition: "transform 0.3s ease-in-out", // Add this line
                  "&:hover": {
                    // Add this block
                    transform: "scale(0.9)", // Change the scale to your preference
                  },
                }}
              >
                <Avatar
                  alt="User Profile"
                  src={
                    "https://i.etsystatic.com/41789378/r/il/b2a211/5242979876/il_570xN.5242979876_d6ul.jpg"
                  }
                  sx={{
                    width: (theme) => theme.spacing(15), // Use a fixed size for width
                    height: (theme) => theme.spacing(15), // Use a fixed size for height to match the width
                    borderRadius: "50%", // This will make it a circle
                    maxWidth: "100%", // Ensure the avatar doesn't exceed the container's width
                    maxHeight: "100%", // Ensure the avatar doesn't exceed the container's height
                    objectFit: "cover", // Cover the area without distorting the aspect ratio
                    marginY: 2, // Optional: Add some vertical margin if needed
                  }}
                />
                <p
                  style={{
                    padding: "20px",
                    fontFamily: "Kanit",
                    fontSize: "30px",
                  }}
                >
                  <span className="red" style={{ color: "#21ecc2" }}>
                    V
                  </span>
                  <span className="blue" style={{ color: "#21ecc2" }}>
                    S
                  </span>
                </p>
                <Avatar
                  alt="User Profile"
                  src={
                    "https://i.etsystatic.com/41789378/r/il/2ab305/5291265949/il_570xN.5291265949_qa29.jpg"
                  }
                  sx={{
                    width: (theme) => theme.spacing(15), // Use a fixed size for width
                    height: (theme) => theme.spacing(15), // Use a fixed size for height to match the width
                    borderRadius: "50%", // This will make it a circle
                    maxWidth: "100%", // Ensure the avatar doesn't exceed the container's width
                    maxHeight: "100%", // Ensure the avatar doesn't exceed the container's height
                    objectFit: "cover", // Cover the area without distorting the aspect ratio
                    marginY: 2, // Optional: Add some vertical margin if needed
                  }}
                />
              </Item>
            </Link>
          ) : (
            <Item
              sx={{
                backgroundColor: "#F1F1F1",
                borderRadius: "30px",
                display: "flex", // Enable flex layout

                alignItems: "center", // Center-align children horizontally
                justifyContent: "center", // Center-align children vertically
                height: "80%", // Adjust the height as needed
                padding: 1,
                overflow: "hidden", // Prevent overflow of children outside the border-radius
                textAlign: "center", // Center the text
                transition: "transform 0.3s ease-in-out", // Add this line
                "&:hover": {
                  // Add this block
                  transform: "scale(0.9)", // Change the scale to your preference
                },
              }}
            >
              <Avatar
                alt="User Profile"
                src={
                  "https://i.etsystatic.com/41789378/r/il/b2a211/5242979876/il_570xN.5242979876_d6ul.jpg"
                }
                sx={{
                  width: (theme) => theme.spacing(15), // Use a fixed size for width
                  height: (theme) => theme.spacing(15), // Use a fixed size for height to match the width
                  borderRadius: "50%", // This will make it a circle
                  maxWidth: "100%", // Ensure the avatar doesn't exceed the container's width
                  maxHeight: "100%", // Ensure the avatar doesn't exceed the container's height
                  objectFit: "cover", // Cover the area without distorting the aspect ratio
                  marginY: 2, // Optional: Add some vertical margin if needed
                }}
              />
              <p
                style={{
                  padding: "20px",
                  fontFamily: "Kanit",
                  fontSize: "30px",
                }}
              >
                <span className="red" style={{ color: "#21ecc2" }}>
                  V
                </span>
                <span className="blue" style={{ color: "#21ecc2" }}>
                  S
                </span>
              </p>
              <Avatar
                alt="User Profile"
                src={
                  "https://i.etsystatic.com/41789378/r/il/2ab305/5291265949/il_570xN.5291265949_qa29.jpg"
                }
                sx={{
                  width: (theme) => theme.spacing(15), // Use a fixed size for width
                  height: (theme) => theme.spacing(15), // Use a fixed size for height to match the width
                  borderRadius: "50%", // This will make it a circle
                  maxWidth: "100%", // Ensure the avatar doesn't exceed the container's width
                  maxHeight: "100%", // Ensure the avatar doesn't exceed the container's height
                  objectFit: "cover", // Cover the area without distorting the aspect ratio
                  marginY: 2, // Optional: Add some vertical margin if needed
                }}
              />
            </Item>
          )}
        </Item>
      </Box>
    );
  };

  const columnshowProfileandVote = () => {
    return (
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <Grid xs={12} md={6} sx={{ margin: 0 }}>
          {profile()}
        </Grid>
        <Grid xs={12} md={6} sx={{ margin: 0 }}>
          {Vote()}
        </Grid>
      </Grid>
    );
  };
  return (
    <Container
      sx={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        minWidth: "100vw",
        objectFit: "cover",
        overflow: "hidden",
      }}
    >
      <Container fixed>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            // height: "100vw",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            marginTop: "20px",
            borderRadius: "30px",
          }}
        >
          {/* <button style={{   position: "fixed", // กำหนดให้อยู่กับที่บนหน้าจอ
              top: 0, // ระยะห่างจากขอบบนสุด
              right: 0, // ระยะห่างจากขอบขวาสุด
              padding: 10,
              backgroundColor: "red",
              color: "white", // กำหนดสีข้อความเป็นสีขาว
              borderRadius: "4px", // ปรับรูปร่างให้มนมุม
              margin: "10px", // กำหนดระยะห่างจากขอบ
              zIndex: 999, // ควบคุมลำดั}}>logout</button>
        }}
          >logout


          </Button>
           */}

          {userdata ? (
            <Button
              style={{
                position: "fixed",
                top: 0, // ระยะห่างจากขอบบนสุด
                right: 0, // ระยะห่างจากขอบขวาสุด
                padding: 10,
                backgroundColor: "red",
                color: "white", // กำหนดสีข้อความเป็นสีขาว
                borderRadius: "40px", // ปรับรูปร่างให้มนมุม
                margin: "20px", // กำหนดระยะห่างจากขอบ
                zIndex: 999, // ควบคุมลำดั}}>logout</button>
              }}
              onClick={logout}
            >
              Logout
            </Button>
          ) : (
            <p></p>
          )}

          <Grid container spacing={2}>
            <Grid xs={12} md={8}>
              {showrank()}
            </Grid>
            <Grid xs={12} md={4}>
              {columnshowProfileandVote()}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Container>
  );
}

function logout() {
  localStorage.removeItem("user_WEBAVD");
  window.location.reload();
}

export default MainPage;
