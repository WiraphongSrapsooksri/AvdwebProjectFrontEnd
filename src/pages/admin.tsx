
// Import your Listuser interface

function AdmainPage() {
  // const [users, setUsers] = useState<Listuser[]>([]);

  // useEffect(() => {
  //   // Fetch data when the component mounts
  //   fetch("http://localhost:4000/get/getListuser")
  //     .then((response) => response.json())
  //     .then((data) => setUsers(data))
  //     .catch((error) => console.error("Error fetching data:", error));
  // }, []);

  return (
    // <Container>
    //   {users.map((user) => (
    //     <Box sx={{ padding: 5 }}>
    //       <Card key={user.id} sx={{ width:"100%"}}>
    //         {/* Assuming image_profile is the path to the image */}
    //         <img
    //           src={user.image_profile}
    //           alt={`Profile for ${user.username}`}
    //         />

    //         <CardContent>
    //           <Typography variant="h5">{user.username}</Typography>
    //           <Typography variant="body1">{user.email}</Typography>
    //         </CardContent>
    //       </Card>
    //     </Box>
    //   ))}
    // </Container>
    <div>
      <h1>Admin Page</h1>
    </div>
  )
}

export default AdmainPage;
