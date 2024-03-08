import { Avatar } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import { Box, Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import background from "../assets/backgroundREG.png";
import { ListRankImage } from "../model/ListRankImage";
import { Usermodel } from "../model/usermode";
import { getRankImageall } from "../service/GetService";
import "./RankCircle.css";
// import Slider from "@mui/material/Slider/Slider";
function MainPage() {
  const [rankImage, setRankImage] = useState<ListRankImage[]>([]);
  const [userdata, setuserdata] = useState<Usermodel>();
  useEffect(() => {
    const fetchData = async () => {
      const data: ListRankImage = await getRankImageall();
      setRankImage(data);
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
  }: {
    rank: number;
    username: string;
    point: number;
    color: string;
    colortext: string;
  }) => (
    <div style={{ display: "flex", padding: 5 }}>
      <div
        className="rank-circle"
        style={{ backgroundColor: color, color: colortext }}
      >
        {rank}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div className="username">{username}</div>
        <div className="point">
          <div style={{ margin: 0 }}>
            <p style={{ margin: 0, fontSize: "10px" }}>Point</p>
            <p style={{ margin: 0 }}>{point}</p>
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
            {rankImage.map((user, index) => {
              return (
                <Box
                  sx={{
                    flex: index < 2 ? "2 0 40%" : "0 0 30%",
                    padding: 0.5,
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
                  </Item>
                </Box>
              );
            })}
          </ImageList>
        </Box>
      </div>
    );
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
          <Link
            to="/profile"
            style={{
              width: "100%",
              height: "100%",
              maxHeight: "100%",
              minHeight: "100%",
              margin: 0,
              padding: 0,
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

export default MainPage;
