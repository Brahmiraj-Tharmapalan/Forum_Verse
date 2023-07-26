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

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(34),
    fontWeight: 900,

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
      background:
        "linear-gradient(to right, #9775FA, cyan)"
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

function Approval() {
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
      feedback: "",
    },
  });

  const { classes, theme } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [featureId, setFeatureId] = useState(null);

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
  const handleApproved = (postId) => {
    const userData = {
      approved: true,
    };

    axios
      .put(`http://52.44.69.205:5000/api/post/${postId}`, userData)
      .then((response) => {
        console.log(response.data);
        fetchAllPosts();
        notify("approved Successfull", "success");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const openModal = (postId) => {
    setFeatureId(postId);
    open();
  };

  const handleFeedback = (postId) => {
    const userData = {
      feedback: form.values.feedback,
    };
    axios
      .put(`http://52.44.69.205:5000/api/post/${postId}`, userData)
      .then((response) => {
        console.log(response.data);
        close();
        fetchAllPosts();
        notify("Post Rejected Successfull", "success");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const features = filteredPosts.map((feature) => (
    <React.Fragment key={feature._id}>
      <Card
        key={feature._id}
        shadow="md"
        radius="md"
        className={classes.card}
        padding="xl"
      >
        <div className={classes.cardHeader}>
          <div className={classes.cardHeaderLeft}>
            {feature.approved === false && feature.feedback === "" ? (
              <>
                <Text fz="lg" fw={700} className={classes.cardTitle1} mt="md">
                  {feature.title}
                </Text>
              </>
            ) : (
              <>
                <Badge variant="filled" size="lg" color="red">
                  Rejected
                </Badge>
                <Text fz="lg" fw={400} className={classes.cardTitle} mt="md">
                  Feedback: {feature.feedback}
                </Text>
                <Text fz="lg" fw={700} className={classes.cardTitle1} mt="md">
                  {feature.title}
                </Text>
              </>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #ccc",
              paddingBottom: "10px",
            }}
          >
            <Text fz="sm" c="dimmed" mt="sm">
              Name: {feature.userId && feature.userId.name}
            </Text>
            <Text fz="sm" c="dimmed" mt="sm">
              {new Date(feature.createdAt).toLocaleString()}
            </Text>
          </div>
        </div>
        <div className={classes.cardBody}>
          <Text fz="lg" fw={400} className={classes.cardTitle} mt="md">
            {feature.content}
          </Text>
        </div>
        {feature.approved === false && feature.feedback === "" ? (
          <div
            className={classes.buttonContainer}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
              borderTop: "1px solid #ccc",
              paddingTop: 10,
            }}
          >
            <Button
              color="teal"
              radius="xl"
              onClick={() => handleApproved(feature._id)}
            >
              Approved
            </Button>
            <Button
              color="red"
              radius="xl"
              onClick={() => openModal(feature._id)}
            >
              Reject
            </Button>
          </div>
        ) : null}
      </Card>
    </React.Fragment>
  ));

  // get posts
  const fetchAllPosts = () => {
    axios
      .get("http://52.44.69.205:5000/api/post")
      .then((response) => {
        console.log(response.data);
        const filteredPosts = response.data.filter((post) => !post.approved);
        setFilteredPosts(filteredPosts);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

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
          Admin Approval
        </Badge>
      </Group>

      <Title order={2} className={classes.title} ta="center" mt="sm">
        Admins need to approve every post.
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        Click the Approved button to approve this post.
      </Text>
      <TextInput
        label="Search"
        placeholder="Search by name or title"
        value={searchQuery}
        onChange={handleSearchInputChange}
      />
      <SimpleGrid
        cols={3}
        spacing="xl"
        mt={50}
        breakpoints={[{ maxWidth: "md", cols: 1 }]}
      >
        {features}
      </SimpleGrid>

      <Modal opened={opened} onClose={close} title="Focus demo">
        <Card shadow="md" radius="md" padding="xl">
          <Box maw={320} mx="auto">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                console.log("Form submitted");
                handleFeedback(featureId);
              }}
            >
              <TextInput
                label="feedback"
                placeholder="feedback"
                value={form.values.feedback}
                onChange={(event) =>
                  form.setFieldValue("feedback", event.currentTarget.value)
                }
                {...form.getInputProps("feedback")}
              />
              <Button type="submit" mt="sm">
                submit
              </Button>
            </form>
          </Box>
        </Card>
      </Modal>
    </Container>
  );
}

export default Approval;
