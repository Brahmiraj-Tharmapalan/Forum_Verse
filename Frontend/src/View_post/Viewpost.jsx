// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
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
  TextInput,
  Paper,
} from "@mantine/core";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
      width: "100%",
      height: "3px",
      marginTop: theme.spacing.sm,
      marginLeft: "auto",
      marginRight: "auto",
      background: "linear-gradient(to right, #9775FA, cyan)",
    },
  },

  cardTitle1: {
    "&::after": {
      content: '""',
      display: "block",
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

function Viewpost() {
  const { viewId } = useParams();

  let id = viewId;

  const { classes, theme } = useStyles();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    axios
      .get(`http://52.44.69.205:5000/api/post/${id}`)
      .then((response) => {
        console.log(response.data);
        setFilteredPosts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    getComments();
  }, []);

  const getComments = () => {
    axios
      .get(`http://52.44.69.205:5000/api/post/${id}/comments`)
      .then((response) => {
        setComments(response.data);
      });
  };

  const comData = {
    content: comment,
    postId: id,
    userId: localStorage.getItem("loginId"),
    createdAt: new Date().toLocaleString() + "",
  };

  const handleSubmit = () => {
    axios
      .post(`http://52.44.69.205:5000/api/comment`, comData)
      .then((response) => {
        setComment("");
        getComments();
        notify("Comment Successfully", "success");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const navigate = useNavigate();
  function handleLogout() {
    navigate("/dashboard");
    notify("welcome to dasboard", "success");
  }
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
        Back to dashboard
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

      <div className={classes.commentSection}>
        <SimpleGrid
          cols={1}
          spacing="xl"
          breakpoints={[{ maxWidth: "md", cols: 1 }]}
        >
          <Card shadow="md" radius="md" className={classes.card} padding="xl">
            <div className={classes.cardHeader}>
              <div
                style={{ display: "flex", justifyContent: "center" }}
                className={classes.cardHeaderLeft}
              >
                <Text fz="lg" fw={700} className={classes.cardTitle1} mt="md">
                  {filteredPosts.title}
                </Text>
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
                <Text fz="lg" fw={400} className={classes.cardTitle} mt="md">
                  Name: {filteredPosts.userId && filteredPosts.userId.name}
                </Text>
                <Text fz="lg" fw={400} className={classes.cardTitle} mt="md">
                  {new Date(filteredPosts.createdAt).toLocaleString()}
                </Text>
              </div>
            </div>
            <div className={classes.cardBody}>
              <Text fz="lg" fw={400} className={classes.cardTitle} mt="md">
                {filteredPosts.content}
              </Text>
            </div>
          </Card>
        </SimpleGrid>

        <div
          className={classes.commentWrapper}
          style={{ padding: "3%", backgroundColor: "#EDF2FF" }}
        >
          <div className={classes.commentInputWrapper}>
            <TextInput
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Write a comment"
              className={classes.commentInput}
            />
            <Button
              variant="outline"
              color="blue"
              className={classes.commentButton}
              onClick={handleSubmit}
              style={{ marginBottom: "2%" }}
            >
              Post
            </Button>
          </div>
          {comments.map((comment, index) => (
            <Paper
              key={index}
              padding="sm"
              shadow="md"
              radius="md"
              color="#ADB5BD"
              style={{ marginBottom: "1rem", padding: "1%" }}
            >
              <Text fz="lg" fw={400} className={classes.cardTitle} mt="md">
                {comment.content}
              </Text>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <Text fz="lg" fw={400} mt="md">
                  {comment.userId.name}
                </Text>

                <Text fz="lg" fw={400} mt="md">
                  {new Date(comment.createdAt).toLocaleString()}
                </Text>
              </div>
            </Paper>
          ))}
        </div>
      </div>
    </Container>
  );
}

export default Viewpost;
