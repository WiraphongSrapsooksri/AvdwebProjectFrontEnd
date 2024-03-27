import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import CloseIcon from "@mui/icons-material/Close";
import CropRotateIcon from "@mui/icons-material/CropRotate";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Avatar,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  ImageList,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { SetStateAction, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import background from "../assets/backgroundREG.png";
import { ChartModel } from "../model/ChartModel";
import { DailyDay } from "../model/DailyDay";
import { ListImageByID } from "../model/ListImageByID";
import { Usermodel } from "../model/usermode";
import {
  getListDailyByday_statsByIduser,
  getListDaily_statsByIduser,
  getListimageById,
  getuserById,
} from "../service/GetService";
import {
  addimage,
  convertImagetoURL,
  deleteimageByuser,
  updateImage,
  updateImageprofile,
  updatedataprofile,
} from "../service/uploadImage";
import "../style/profile.css";
import DifferentLength from "./DifferentLength";
export default function ProfilePage() {
  const [userdata, setuserdata] = useState<Usermodel>();
  const [listImageofuser, setlistImageofuser] = useState<ListImageByID[]>([]);
  const [chartData, setChartData] = useState<ChartModel[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileInsert, setSelectedFileInsert] = useState<File | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [openfileeditprofile, setOpenfileeditprofile] = useState(false);
  const [openEditprofile, setOpenEditprofile] = useState(false);
  const [openInsert, setOpenInsert] = useState(false);
  const [previewUrlInsert, setPreviewUrlInsert] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(0);
  const [user_id, setUser_id] = useState(0);
  const [DailyData, setDailyData] = useState<DailyDay[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [refreshUserData, setRefreshUserData] = useState(false);
  const [usernameEDIT, setUsernameEDIT] = useState(userdata?.username || "");
  const [emailEDIT, setEmailEDIT] = useState(userdata?.email || "");
  const [akaEDIT, setAkaEDIT] = useState(userdata?.aka || "");
  // const user_id = userdata?.id;
  const handleUsernameChange = (event: { target: { value: SetStateAction<string>; }; }) => setUsernameEDIT(event.target.value);
  const handleEmailChange = (event: { target: { value: SetStateAction<string>; }; }) => setEmailEDIT(event.target.value);
  const handleAkaChange = (event: { target: { value: SetStateAction<string>; }; }) => setAkaEDIT(event.target.value);

  useEffect(() => {
    async function fetchUserDataAndImages() {
      try {
        const userDataStr = localStorage.getItem("user_WEBAVD");
        if (!userDataStr) return;

        const users: Usermodel = JSON.parse(userDataStr);
        const getuser: Usermodel[] = await getuserById(users.id);
        const user = getuser[0];
        setuserdata(getuser[0]);
        localStorage.setItem("user_WEBAVD", JSON.stringify(getuser[0]));

        if (!user?.id) return;

        const DailyData: DailyDay[] = await getListDailyByday_statsByIduser(
          user.id
        );
        setDailyData(DailyData);

        const imageList: ListImageByID[] = await getListimageById(user.id);
        setlistImageofuser(imageList);

        const liststats: ChartModel[] = await getListDaily_statsByIduser(
          user.id
        );
        setChartData(liststats);
      } catch (error) {
        console.error("Error fetching user data and images:", error);
      }
    }

    fetchUserDataAndImages();
    // Reset the trigger after the data is fetched
    if (refreshUserData) {
      setRefreshUserData(false);
    }
  }, [refreshUserData]);

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

  // const Item = styled(Paper)(({ theme }) => ({
  //   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  //   ...theme.typography.body2,
  //   padding: theme.spacing(1),
  //   textAlign: "center",
  //   color: theme.palette.text.secondary,
  //   flexGrow: 1,
  // }));

  const handleClickOpeneEditProfile = () => {
    setOpenEditprofile(true);
  };

  const handleCloseEditProfile = () => {
    setOpenEditprofile(false);
  };

  const handleSaveEditProfile = async () => {
    // Initialize the edited values to null
    let usernameToSave = null;
    let emailToSave = null;
    let akaToSave = null;

    // Only set the edited values if they are different from the original userdata
    if (usernameEDIT !== "" && usernameEDIT !== userdata?.username) {
      usernameToSave = usernameEDIT;
    }
    if (emailEDIT !== "" && emailEDIT !== userdata?.email) {
      emailToSave = emailEDIT;
    }
    if (akaEDIT !== "" && akaEDIT !== userdata?.aka) {
      akaToSave = akaEDIT;
    }

    // Check if any of the values have been edited before making the API call
    if (usernameToSave !== null || emailToSave !== null || akaToSave !== null) {
      console.log("Updating profile with new data...");
      const response = await updatedataprofile(
        usernameToSave ?? userdata?.username as string,
        userdata?.id as number,
        emailToSave ?? userdata?.email as string,
        akaToSave ?? userdata?.aka as string
      );

      // Handle the response
      if (response.status) {
        console.log(response.message);
        // If you have a function to refresh the user data, call it here
        setRefreshUserData(true);
      } else {
        console.error("Failed to update profile:", response.message);
      }
    } else {
      console.log("No changes detected. No update necessary.");
    }

    // Close the edit profile dialog
    setOpenEditprofile(false);
  };

  const editImageProfile = () => {
    console.log("edit Image Profile");
    setOpenfileeditprofile(true);
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
          <Box
            sx={{
              position: "relative",
              "&:hover": {
                "& .editIcon": {
                  opacity: 1, // Show the edit icon on hover
                },
              },
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
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
            <IconButton
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                opacity: 0, // Hide the button initially
                transition: "opacity 0.3s",
                zIndex: 2, // Ensure the button is above the Avatar
                // More styles for the IconButton
              }}
              className="editIcon"
              style={{ opacity: isHovered ? 1 : 0 }}
              onClick={() => {
                console.log("edit Image Profile");
                editImageProfile();
              }}
            >
              <CropRotateIcon color="error" />
            </IconButton>
          </Box>
          {/* <Avatar
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
          /> */}
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
            <Button variant="outlined" onClick={handleClickOpeneEditProfile}>
              Edit Profile
            </Button>
            <Dialog
              open={openEditprofile}
              onClose={handleClickOpeneEditProfile}
            >
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  id="aka"
                  label="Name"
                  type="text"
                  fullWidth
                  variant="standard"
                  defaultValue={userdata?.aka}
                  // value={userdata?.aka}
                  onChange={handleAkaChange}
                />
                <TextField
                  margin="dense"
                  id="username"
                  label="Username"
                  type="text"
                  fullWidth
                  variant="standard"
                  defaultValue={userdata?.username}
                  onChange={handleUsernameChange}
                />
                <TextField
                  margin="dense"
                  id="email"
                  label="Email"
                  type="text"
                  fullWidth
                  variant="standard"
                  defaultValue={userdata?.email}
                  onChange={handleEmailChange}
                />

                {/* สามารถเพิ่ม TextField อื่นๆ ตามข้อมูลที่ต้องการแก้ไขได้ */}
              </DialogContent>
              <DialogContent>
                <Button onClick={handleCloseEditProfile}>Cancel</Button>
                <Button onClick={handleSaveEditProfile}>Save</Button>
              </DialogContent>
            </Dialog>
            <Dialog
              open={openfileeditprofile}
              onClose={handleClose}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>
                Update Image Profile
                {handleClose ? (
                  <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      color: (theme) => theme.palette.grey[500],
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                ) : null}
              </DialogTitle>
              <DialogContent dividers>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    marginTop: 2,
                  }}
                >
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="raised-button-file"
                    multiple
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="raised-button-file">
                    <Button
                      variant="contained"
                      component="span"
                      disabled={loading}
                    >
                      Choose Image
                    </Button>
                  </label>
                  {previewUrl && (
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 2,
                      }}
                    >
                      <img
                        src={previewUrl}
                        alt="Image preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "400px",
                          borderRadius: "4px",
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleUploadeditprofile(userdata?.id ?? 0)}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={24} /> : null}
                >
                  {loading ? "Uploading..." : "Upload"}
                </Button>
              </DialogActions>
            </Dialog>
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
                      top: 50,
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
                  <Box sx={{ textAlign: "center" }}>
                    <button
                      style={{
                        margin: "10px",
                        backgroundColor: "red",
                        color: "white",
                        borderRadius: "10px",
                        width: "60px",
                        height: "30px",
                        fontSize: "15px",
                        fontFamily: "Kanit",
                      }}
                      onClick={() => {
                        deleteImage(image.imgid, image.userid);
                      }}
                    >
                      Delete
                    </button>
                    <button
                      style={{
                        margin: "10px",
                        backgroundColor: "#FFBF00",
                        color: "black",
                        borderRadius: "10px",
                        width: "60px",
                        height: "30px",
                        fontSize: "15px",
                        fontFamily: "Kanit",
                      }}
                      onClick={() => handleClickOpen(image.imgid, image.userid)}
                    >
                      Edit
                    </button>

                    <Dialog
                      open={open}
                      onClose={handleClose}
                      fullWidth
                      maxWidth="sm"
                    >
                      <DialogTitle>
                        Update Image
                        {handleClose ? (
                          <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={{
                              position: "absolute",
                              right: 8,
                              top: 8,
                              color: (theme) => theme.palette.grey[500],
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        ) : null}
                      </DialogTitle>
                      <DialogContent dividers>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                            marginTop: 2,
                          }}
                        >
                          <input
                            accept="image/*"
                            style={{ display: "none" }}
                            id="raised-button-file"
                            multiple
                            type="file"
                            onChange={handleFileChange}
                          />
                          <label htmlFor="raised-button-file">
                            <Button
                              variant="contained"
                              component="span"
                              disabled={loading}
                            >
                              Choose Image
                            </Button>
                          </label>
                          {previewUrl && (
                            <Box
                              sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                marginTop: 2,
                              }}
                            >
                              <img
                                src={previewUrl}
                                alt="Image preview"
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "400px",
                                  borderRadius: "4px",
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose} disabled={loading}>
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleUpload()}
                          disabled={loading}
                          startIcon={
                            loading ? <CircularProgress size={24} /> : null
                          }
                        >
                          {loading ? "Uploading..." : "Upload"}
                        </Button>
                      </DialogActions>
                    </Dialog>
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
            >
              {(!listImageofuser || listImageofuser.length < 5) && (
                <AddCircleOutlineIcon
                  style={{
                    color: "#007bff", // กำหนดสีของไอคอน
                    fontSize: "3rem", // กำหนดขนาดของไอคอน
                    cursor: "pointer", // เปลี่ยนรูปแบบของเมาส์เมื่อชี้ที่ไอคอน
                    transition: "all 0.3s ease", // เพิ่มเอฟเฟกต์การเปลี่ยนแปลงอย่างนุ่มนวล
                    position: "relative",
                  }}
                  onClick={() => handleClickOpenInsert(userdata?.id ?? 0)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.2)"; // ขยายขนาดไอคอนเมื่อเมาส์วางบน
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)"; // คืนขนาดไอคอนเมื่อเมาส์ออก
                  }}
                />
              )}
              <Dialog
                open={openInsert}
                onClose={handleCloseInsert}
                fullWidth
                maxWidth="sm"
              >
                <DialogTitle>
                  Add Image
                  {handleCloseInsert ? (
                    <IconButton
                      aria-label="close"
                      onClick={handleCloseInsert}
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  ) : null}
                </DialogTitle>
                <DialogContent dividers>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                      marginTop: 2,
                    }}
                  >
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="raised-button-file"
                      multiple
                      type="file"
                      onChange={handleFileChangeInsert}
                    />
                    <label htmlFor="raised-button-file">
                      <Button
                        variant="contained"
                        component="span"
                        disabled={loading}
                      >
                        Choose Image
                      </Button>
                    </label>
                    {previewUrlInsert && (
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          marginTop: 2,
                        }}
                      >
                        <img
                          src={previewUrlInsert}
                          alt="Image preview"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "400px",
                            borderRadius: "4px",
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseInsert} disabled={loading}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => appimage()}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={24} /> : null}
                  >
                    {loading ? "Uploading..." : "Upload"}
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </ImageList>
        </Box>
      </Box>
    );
  };

  const appimage = async () => {
    console.log(user_id);
    if (selectedFileInsert) {
      setLoading(true); // Set loading to true before the upload starts
      console.log("add image ", selectedFileInsert);

      try {
        const response = await convertImagetoURL(selectedFileInsert);
        console.log(response.url);

        const app = await addimage(response.url, user_id);

        if (app.status) {
          console.log("S" + app.status);
          window.location.reload();
        }
        console.log(response);
      } catch (error) {
        console.error("Upload failed:", error);
        // You might want to handle the error here, perhaps setting an error state
      }

      setLoading(false); // Set loading to false after the upload completes
      handleCloseInsert(); // Close the dialog after upload
    }
  };

  const handleClickOpenInsert = (user_id: number) => {
    console.log(user_id);
    setOpenInsert(true);
    setUser_id(user_id);
  };

  const handleCloseInsert = () => {
    setOpenInsert(false);
    setSelectedFileInsert(null);
    setPreviewUrlInsert("");
  };

  const handleFileChangeInsert = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFileInsert(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrlInsert(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickOpen = (id: number, user_id: number) => {
    // Your existing logic to open the dialog
    console.log(id);
    console.log(user_id);
    setId(id);
    setUser_id(user_id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Also reset selected file and preview URL
    setSelectedFile(null);
    setPreviewUrl("");
    setOpenfileeditprofile(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setLoading(true); // Set loading to true before the upload starts
      console.log("Uploading", selectedFile);

      try {
        const response = await convertImagetoURL(selectedFile);
        console.log(response.url);
        const jsons = {
          image_url: response.url,
          image_id: id,
          user_id: user_id,
        };
        console.log(jsons);

        const update = await updateImage(
          jsons.image_url,
          jsons.image_id,
          jsons.user_id
        );

        if (update.status) {
          console.log("S" + update.status);
          window.location.reload();
        }
        console.log(response);
      } catch (error) {
        console.error("Upload failed:", error);
        // You might want to handle the error here, perhaps setting an error state
      }

      setLoading(false); // Set loading to false after the upload completes
      handleClose(); // Close the dialog after upload
    }
  };

  const handleUploadeditprofile = async (user_id: number) => {
    if (selectedFile) {
      setLoading(true); // Set loading to true before the upload starts
      console.log("Uploading", selectedFile);

      try {
        const response = await convertImagetoURL(selectedFile);
        console.log(response.url);
        const jsons = {
          image_url: response.url,
          user_id: user_id,
        };
        console.log(jsons);

        const update = await updateImageprofile(jsons.image_url, jsons.user_id);

        if (update.status) {
          console.log("S" + update.status);
          const getuser: Usermodel[] = await getuserById(user_id);
          setuserdata(getuser[0]);
          window.location.reload();
        }
        console.log(response);
      } catch (error) {
        console.error("Upload failed:", error);
        // You might want to handle the error here, perhaps setting an error state
      }

      setLoading(false); // Set loading to false after the upload completes
      handleClose(); // Close the dialog after upload
    }
  };

  // const handleUploadeditprofile = async (user_id: number) => {
  //   if (selectedFile) {
  //     setLoading(true);

  //     try {
  //       // ... your existing upload logic ...

  //       const updatedUser: Usermodel = await getuserById(user_id);
  //       // Make sure 'updatedUser' is the correct format before stringifying it.
  //       localStorage.setItem("user_WEBAVD", JSON.stringify(updatedUser));

  //       setuserdata(updatedUser); // Update state to reflect new user data
  //       setRefreshUserData(true); // Trigger useEffect to re-fetch all related data

  //     } catch (error) {
  //       console.error("Upload failed:", error);
  //     } finally {
  //       setLoading(false);
  //       handleClose();
  //     }
  //   }
  // };

  const deleteImage = async (id: number, user_id: number) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this image?"
    );
    if (!isConfirmed) {
      return; // Exit the function if the user cancels.
    }
    try {
      const response = await deleteimageByuser(id, user_id);
      if (response.status) {
        console.log("S" + response.status);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
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
              <Link to="/" style={{ position: "absolute", left: 30 }}>
                <ArrowCircleLeftIcon className="arrow-icon" />
              </Link>
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
