import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import { Avatar, Container, Grid, ImageList } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import background from "../assets/backgroundREG.png";
import { ChartModel } from "../model/ChartModel";
import { ListImageByID } from "../model/ListImageByID";
import { Usermodel } from "../model/usermode";
import {
  getListDailyByday_statsByIduser,
  getListDaily_statsByIduser,
  getListimageById,
  getuserById,
} from "../service/GetService";

import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { DailyDay } from "../model/DailyDay";
import "../style/profile.css";
import DifferentLength from "./DifferentLength";

export default function ProfileViewPage() {
  const { user_idIN } = useParams();
  const [userdata, setuserdata] = useState<Usermodel>();
  const [listImageofuser, setlistImageofuser] = useState<ListImageByID[]>([]);
  const [chartData, setChartData] = useState<ChartModel[]>([]);

  // const [id, setId] = useState(0);
  // const [user_id, setUser_id] = useState(0);
  const [DailyData, setDailyData] = useState<DailyDay[]>([]);

  useEffect(() => {
    async function fetchUserDataAndImages() {
      try {
        const user = await getuserById(Number(user_idIN));

        setuserdata(user[0]);

        const DailyData: DailyDay[] = await getListDailyByday_statsByIduser(
          Number(user_idIN)
        );
        setDailyData(DailyData);

        const imageList: ListImageByID[] = await getListimageById(
          Number(user_idIN)
        );
        setlistImageofuser(imageList);

        const liststats: ChartModel[] = await getListDaily_statsByIduser(
          Number(user_idIN)
        );
        // console.log(liststats);
        setChartData(liststats);
      } catch (error) {
        console.error("Error fetching user data and images:", error);
      }
    }

    fetchUserDataAndImages();
  }, []);

  const compare = (imageid: number) => {
    const dd = DailyData;
    const result = dd.find((data) => data.image_id === imageid);
    if (!result) return <p style={{ color: "gray", margin: 0 }}>-</p>;

    const df = result.prev_rank - result.rank;

    if (df > 0) {
      // อันดับดีขึ้น (ค่าน้อยลง) แสดงสีเขียว
      return (
        <Box sx={{ display: "flex" }}>
          <p style={{ color: "green", margin: 0 }}>+{Math.abs(df)}</p>
          <KeyboardArrowUpIcon sx={{ color: "green", marginBlock: -0.3 }} />
        </Box>
      );
    } else if (df < 0) {
      // อันดับแย่ลง (ค่ามากขึ้น) แสดงสีแดง
      return (
        <Box sx={{ display: "flex" }}>
          <p style={{ color: "red", margin: 0 }}>{df}</p>
          <KeyboardArrowDownIcon sx={{ color: "red", marginBlock: -0.3 }} />
        </Box>
      );
    } else {
      return (
        <Box sx={{ display: "flex" }}>
          <p style={{ color: "gray", margin: 0 }}></p>
          <HorizontalRuleIcon sx={{ color: "gray", marginBlock: -0.3 }} />
        </Box>
      );
    }
  };

  const row1 = () => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          //   maxWidth: "80vw",
          width: "100%",
          margin: 0,
          padding: 2,

          //   backgroundColor: "rgba(255, 255, 255, 1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 2,
            margin: 0,
            backgroundColor: "rgba(255, 255, 255, 1)",
            height: "30vh",
            borderRadius: "30px",
            minWidth: "20vw",
            minHeight: "25vh",
          }}
        >
          <Avatar
            alt="User Profile"
            src={userdata?.image_profile}
            sx={{
              width: (theme) => theme.spacing(22), // Use a fixed size for width
              height: (theme) => theme.spacing(22), // Use a fixed size for height to match the width
              borderRadius: "50%", // This will make it a circle
              maxWidth: "100%", // Ensure the avatar doesn't exceed the container's width
              maxHeight: "100%", // Ensure the avatar doesn't exceed the container's height
              objectFit: "cover", // Cover the area without distorting the aspect ratio
              marginY: 2, // Optional: Add some vertical margin if needed
              margin: 0,
            }}
          />
          <Box sx={{ padding: 4 }}>
            <p className="textprofilesetA">
              <strong>id:</strong>
              {userdata?.id}
            </p>
            <p className="textprofilesetA">
              <strong>Name:</strong> {userdata?.aka}
            </p>
            <p className="textprofilesetA">
              <strong>Username:</strong> {userdata?.username}
            </p>
            <p className="textprofilesetA">
              <strong>Email:</strong>
              {userdata?.email}
            </p>
            <p className="textprofilesetA">
              <strong>created_at:</strong>
              {userdata && userdata.created_at
                ? new Date(userdata.created_at).toLocaleDateString("th-TH")
                : "N/A"}
            </p>
            <p className="textprofilesetA">
              <strong>Bio:</strong>
              {userdata?.textBio}
            </p>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 1)",
            margin: 2,
            borderRadius: "30px",
            minWidth: "20vw",

            // minHeight: "40vh",
          }}
        >
          <Box sx={{ marginTop: 4, minHeight: "30vh", paddingRight: 3 }}>
            {chartData && chartData.length > 0 ? (
              <DifferentLength chartData={chartData} />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "25vh",
                }}
              >
                <p>No data</p>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  const row2 = () => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          // alignItems: "center",
          padding: 1,

          backgroundColor: "rgba(255, 255, 255, 1)",
          // margin: 2,
          // marginLeft: 4,

          borderRadius: "30px",
          minHeight: "35vh",
        }}
      >
        <Box>
          <ImageList
            cols={5}
            sx={{
              height: "100%",
              margin: 0,
              padding: 0,
              overflowX: "hidden",
              "&::-webkit-scrollbar": { width: "0px" },
              "&::-webkit-scrollbar-track": { background: "#FCFCFC" },
              "&::-webkit-scrollbar-thumb": { background: "#BBBBBB" },
              "&::-webkit-scrollbar-thumb:hover": { background: "#BBBBBB" },
            }}
          >
            {listImageofuser?.map((image) => (
              <Box
                key={image.imgid}
                sx={{
                  borderRadius: "30px",
                  padding: 0,
                  position: "relative",
                  "&:hover .image-overlay": {
                    // เพิ่ม class เพื่อการควบคุม hover
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
              >
                <Box
                  sx={{
                    backgroundColor: "white",
                    fontFamily: "Kanit",
                    fontSize: "14px",
                    borderRadius: "0px 0px 20px 0px",
                    width: "40px",
                    height: "40px",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                >
                  <p style={{ margin: 0, paddingLeft: 2, fontSize: "18px" }}>
                    R{image.rank}
                  </p>
                  <p style={{ marginTop: -5 }}>{compare(image.imgid)}</p>
                </Box>

                <img
                  src={image.image_url}
                  alt={image.imgid?.toString() ?? "default-alt"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "30px",
                  }}
                />
                {/* โอเวอร์เลย์ที่จะแสดงตัวเลือก */}
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
                  {/* ตัวเลือกต่าง ๆ */}
                  <Box
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      fontFamily: "Kanit",
                      fontSize: "14px",
                      borderRadius: "10px",
                      width: "125px",
                      padding: 0.5,
                      // height: "30px",
                      position: "absolute",
                      top: 120,
                      // right: 0,
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        textAlign: "center",
                        fontStyle: "initial",
                        fontSize: "18px",
                      }}
                    >
                      ID:{image.imgid}
                    </p>
                    <p style={{ margin: 0, textAlign: "start" }}>
                      rank:{image.rank}
                    </p>
                    <p style={{ margin: 0, textAlign: "start" }}>
                      vote:{image.votes}
                    </p>
                    <p style={{ margin: 0, textAlign: "start" }}>
                      Create:{" "}
                      {new Date(image.created_at).toLocaleDateString("en-GB")}
                    </p>
                  </Box>
                </Box>
              </Box>
            ))}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",

                marginLeft: 1,
                // backgroundColor:'red'
              }}
            ></Box>
          </ImageList>
        </Box>
      </Box>
    );
  };

  // const BackPage = () => {
  //   const location = useLocation();
  //   console.log(location.pathname);
    
  //   // ตรวจสอบว่าไม่ได้อยู่ในหน้า /admin ก่อนคืนค่าลิงก์กลับไปยัง /admin
  //   if (location.pathname !== "/admin") {
  //     return (
  //       <Link to="/admin" style={{ position: "absolute", left: 30 }}>
  //         <ArrowCircleLeftIcon className="arrow-icon" />
  //       </Link>
  //     );
  //   } else {
  //     <Link to="/main" style={{ position: "absolute", left: 30 }}>
  //       <ArrowCircleLeftIcon className="arrow-icon" />
  //     </Link>;
  //   }
  // };

  const BackLink = () => {
    // อ่านค่า prevPath จาก localStorage
    const prevPath = localStorage.getItem('prevPath') || '/';  
    return (
      <Link to={prevPath} style={{ position: "absolute", left: 30 }}>
        <ArrowCircleLeftIcon className="arrow-icon" />
      </Link>
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
            padding: 1,
            // height: "100vw",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            marginTop: "10px",
            borderRadius: "30px",
          }}
        >
          <Grid container spacing={2} sx={{ margin: 0 }}>
            <Grid
              item
              xs={12}
              md={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative", // ให้สามารถใช้ positioning ได้
              }}
            >
              {BackLink()}
              {/* <Link to="/admin" style={{ position: "absolute", left: 30 }}>
                <ArrowCircleLeftIcon className="arrow-icon" />
              </Link> */}
              {/* {BackPage()} */}
              <p style={{ fontFamily: "Kanit", fontSize: "35px", margin: 0 }}>
                Profile
              </p>
            </Grid>
            <Grid item xs={12} md={12} marginTop={"-40px"}>
              {row1()}
            </Grid>
            <Grid
              item
              xs={12}
              md={12}
              margin={"0px"}
              padding={"0px"}
              marginTop={"-40px"}
              marginRight={2}
            >
              {row2()}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Container>
  );
}
