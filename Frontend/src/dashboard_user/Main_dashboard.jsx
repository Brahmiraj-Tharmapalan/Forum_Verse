import React, { useState, useEffect } from "react";
import {
  createStyles,
  Badge,
  Group,
  Title,
  Text,
  Card,
  SimpleGrid,
  Container,
  rem,
  Button,
  Modal,
  Box,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

//style
const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(34),
    fontWeight: 900,
    background: "linear-gradient(to right, #9775FA, cyan)",
    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(24),
    },
  },

  Name: {
    fontSize: rem(34),
    fontWeight: 900,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(24),
    },
  },

  description: {
    maxWidth: 600,
    margin: "auto",

    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: "50%",
      height: rem(2),
      marginTop: theme.spacing.sm,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },

  card: {
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  cardTitle: {
    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: "100%",
      height: rem(2),
      marginTop: theme.spacing.sm,
      background: "linear-gradient(to right, #9775FA, cyan)",
    },
  },
  cardTitle1: {
    "&::after": {
      content: '""',
      display: "block",
      backgroundColor: theme.fn.primaryColor(),
      width: "100%",
      height: rem(4),
      marginTop: theme.spacing.sm,
      marginLeft: "auto",
      marginRight: "auto",
      background: "linear-gradient(to right, #9775FA, cyan)",
    },
  },

  commentSection: {
    marginTop: theme.spacing.xl,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    columnGap: theme.spacing.md,
  },

  commentInput: {
    gridColumn: "1 / span 2",
    marginBottom: theme.spacing.md,
  },

  commentButton: {
    justifySelf: "end",
  },

  commentBox: {
    gridColumn: "1 / span 2",
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
}));

function Dashboard() {
  let userId = localStorage.getItem("loginId");
  const navigate = useNavigate();

  function handleLogout() {
    const confirmDelete = window.confirm("Are you sure to logout?");
    if (confirmDelete) {
      navigate("/");
      localStorage.clear();
      notify("Logout Successfull", "success");
    }
  }

  const form = useForm({
    initialValues: {
      title: "",
      content: "",
    },
  });

  const { classes, theme } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  function handleSearchInputChange(event) {
    const query = event.target.value;
    setSearchQuery(query);

    // If the search bar is empty, show all posts
    if (query === "") {
      fetchAllPosts();
    } else {
      // Filter the posts by name
      const filtered = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          (post.userId &&
            post.userId.name.toLowerCase().includes(query.toLowerCase())) ||
          post.createdAt.toLowerCase().includes(query.toLowerCase())
      );

      // Filtered posts by time
      const sortedPosts = filtered.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setFilteredPosts(sortedPosts);
    }
  }
  const handleView = (viewId) => {
    navigate(`/view/${viewId}`);
    notify("Welcome to the post", "success");
  };

  const handleDelete = (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmDelete) {
      axios
        .delete(`http://52.44.69.205:5000/api/post/${postId}`)
        .then((response) => {
          console.log(response.data);
          fetchAllPosts();
          notify("Your Post Deleted Successfully", "success");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const features = filteredPosts.map((feature) => (
    <React.Fragment key={feature._id}>
      {feature.approved === true ? (
        <Card
          key={feature._id}
          shadow="md"
          radius="md"
          className={classes.card}
          padding="xl"
        >
          <div style={{ display: "flex", justifyContent: "flex-end" }}></div>
          <div className={classes.cardHeader}>
            <div
              className={classes.cardHeaderLeft}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text fz="lg" fw={700} className={classes.cardTitle1} mt="md">
                {feature.title}
              </Text>
              {feature.userId && feature.userId._id === userId ? (
                <Button
                  variant="subtle"
                  color="red"
                  radius="xl"
                  size="md"
                  style={{ fontSize: 25, fontWeight: 700 }}
                  onClick={() => handleDelete(feature._id)}
                >
                  X
                </Button>
              ) : (
                ""
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text className={classes.cardTitle} fz="sm" c="dimmed" mt="sm">
                Name: {feature.userId && feature.userId.name}
              </Text>
              <Text className={classes.cardTitle} fz="sm" c="dimmed" mt="sm">
                {new Date(feature.createdAt).toLocaleString()}
              </Text>
            </div>
          </div>
          <div className={classes.cardBody}>
            <Text fz="lg" fw={400} mt="md">
              {feature.content}
            </Text>
          </div>
          <div className={classes.buttonContainer}>
            <Button
              radius="xl"
              style={{ flex: 1 }}
              onClick={() => handleView(feature._id)}
            >
              View More
            </Button>
          </div>
        </Card>
      ) : null}
    </React.Fragment>
  ));

  // get posts
  const fetchAllPosts = () => {
    axios
      .get("http://52.44.69.205:5000/api/post")
      .then((response) => {
        console.log(response.data);

        setFilteredPosts(response.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const handleFormSubmit = () => {
    console.log("handleFormSubmit called");
    const userData = {
      title: form.values.title,
      content: form.values.content,
      userId: userId,
      approved: false,
      feedback: "",
      createdAt: new Date().toLocaleString() + "",
    };
    console.log(userData);
    axios
      .post("http://52.44.69.205:5000/api/post", userData)
      .then((response) => {
        notify("Wow Post created successfully", "success");
        console.log(response);
        form.reset();
        close();
        fetchAllPosts();
      })
      .catch((error) => {
        alert("Error creating post");
      });
  };

  const notify = (message, type) => {
    const options = {
      position: "top-left",
    };
    if (type === "success") {
      toast.success(message, options);
    } else if (type === "error") {
      toast.error(message, options);
    }
  };
  return (
    <>
      <Container size="lg" py="xl">
        <Button
          variant="gradient"
          mt={10}
          ml={"100%"}
          gradient={{ from: "indigo", to: "cyan" }}
          onClick={handleLogout}
        >
          Logout
        </Button>
        <Group position="center">
          <Badge variant="filled" size="lg">
            Welcome to Mobile Posts
          </Badge>
        </Group>

        <Title order={2} className={classes.title} ta="center" mt="sm">
          Approved posts will be posted here.
        </Title>

        <Text c="dimmed" className={classes.description} ta="center" mt="md">
          You can comment on any post as you wish.
        </Text>

        <TextInput
          label="Search"
          placeholder="Search by name or title"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />

        <Group position="center">
          <Button
            variant="gradient"
            mt={30}
            gradient={{ from: "indigo", to: "cyan" }}
            onClick={open}
          >
            Create Post
          </Button>
        </Group>

        <SimpleGrid
          cols={3}
          spacing="xl"
          mt={50}
          breakpoints={[{ maxWidth: "md", cols: 1 }]}
        >
          {features}
        </SimpleGrid>
      </Container>
      <Modal opened={opened} onClose={close} title="Focus demo">
        <Card shadow="md" radius="md" padding="xl">
          <Box maw={320} mx="auto">
            <form
              onSubmit={(event) => {
                event.preventDefault(); 
                console.log("Form submitted");
                handleFormSubmit();
              }}
            >
              <TextInput
                label="Title"
                placeholder="Title"
                value={form.values.title}
                onChange={(event) =>
                  form.setFieldValue("title", event.currentTarget.value)
                }
                {...form.getInputProps("title")}
              />

              <TextInput
                label="Content"
                placeholder="Content"
                value={form.values.content}
                onChange={(event) =>
                  form.setFieldValue("content", event.currentTarget.value)
                }
                mt="sm"
                {...form.getInputProps("content")}
              />
              <Button type="submit" mt="sm">
                Post
              </Button>
            </form>
          </Box>
        </Card>
      </Modal>
    </>
  );
}

export default Dashboard;
