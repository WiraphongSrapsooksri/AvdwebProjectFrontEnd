import { Box, Button, Container } from "@mui/material";
import background from "../assets/backgroundREG2.png";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// Improved styling for Paper and button
import ImageList from "@mui/material/ImageList";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RankModel } from "../model/rankModel";
import { Usermodel } from "../model/usermode";
import { getRankImageall } from "../service/GetService";

function AdminPage() {
  const [rankImage, setRankImage] = useState<RankModel[]>([]);
  const [userdata, setuserdata] = useState<Usermodel>();
  const location = useLocation();
  const history = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const data: RankModel[] = await getRankImageall();

      setRankImage(data);
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
    };
    fetchData();
  }, []);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    flexGrow: 1,
  }));

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
            // sx={{
            //   height: "100%",
            //   width: "35vw",
            //   margin: 0,
            //   padding: 0,
            //   overflowX: "hidden",
            //   "&::-webkit-scrollbar": { width: "0px" },
            //   "&::-webkit-scrollbar-track": { background: "#FCFCFC" },
            //   "&::-webkit-scrollbar-thumb": { background: "#BBBBBB" },
            //   "&::-webkit-scrollbar-thumb:hover": { background: "#BBBBBB" },
            // }}
            sx={{
              height: "80vh",
              display: "flex",
              flexWrap: "wrap",
              width: "50vw",

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
                  key={user.id}
                  sx={{
                    borderRadius: "30px",
                    padding: 0,
                    position: "relative",
                    "&:hover .image-overlay": {
                      opacity: 1,
                      transition: "opacity 0.3s ease-in-out",
                    },
                  }}
                  onMouseEnter={() => {
                    /* ที่นี่คุณสามารถเพิ่มโค้ดเพื่อการตอบสนองเมื่อเมาส์เข้ามา */
                  }}
                  onMouseLeave={() => {
                    /* และที่นี่เมื่อเมาส์ออกไป */
                  }}
                  // onMouseEnter={() => setHoveredUserId(user.user_id)} // Set hovered user ID
                  // onMouseLeave={() => setHoveredUserId(null)} // Clear hovered user ID
                >
                  <Item
                    sx={{
                      borderRadius: "30px",
                      padding: 1,
                      width: "15vw",

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

  const logout = () =>{
    localStorage.removeItem("user_WEBAVD");
    history('/')
  }

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
      <Container fixed>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 2,
            // height: "100vw",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            marginTop: "10px",
            borderRadius: "30px",
          }}
        >
          {showrank()}
        </Box>
      </Container>
    </Container>
  );
}


export default AdminPage;
