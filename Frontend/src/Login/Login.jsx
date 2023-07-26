import React from "react";
import axios from "axios";
import { useToggle } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const [type, toggle] = useToggle(["Login", "Register"]);

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
    },

    //valiation for password
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  //login request
  const baseURL = "http://52.44.69.205:5000/api";
  const handleFormSubmit = () => {
    if (type === "Login") {
      const params = {
        email: form.values.email,
        password: form.values.password,
      };
      axios
        .post(`${baseURL}/login`, params)
        .then((response) => {
          localStorage.setItem("loginId", response.data.id);
          const user = response.data;
          if (user) {
            if (response.data.isAdmin === true) {
              navigate(`/approval`);
              notify("Welcome to Aprooval", "success");
            } else {
              navigate(`/dashboard`);
              notify("Welcome to dashboard", "success");
            }
          }
        })
        .catch((error) => {
          console.error(error);
          notify("Invalid email or password", "error");
        });
    } else {
      const userData = {
        name: form.values.name,
        email: form.values.email,
        password: form.values.password,
        isAdmin: false,
      };

      //register request
      axios
        .post(`${baseURL}/User`, userData)
        .then((response) => {
          console.log(response);
          notify("Registration successfull", "success");
        })
        .catch((error) => {
          console.error(error);
          notify("User email already registered", "error");
        });
    }
  };

  //toast
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
    <div
      style={{ paddingTop: "8%", display: "flex", justifyContent: "center" }}
    >
      <Paper
        radius="md"
        padding="lg"
        shadow="sm"
        style={{ padding: "1%", maxWidth: "400px", width: "100%" }}
      >
        <Text
          size="lg"
          weight={500}
          style={{ display: "flex", justifyContent: "center" }}
        >
          {type} Page
        </Text>
        <Text
          size="lg"
          weight={500}
          style={{ display: "flex", justifyContent: "center" }}
        >
          Welcome to Mobile Poster
        </Text>

        <Divider label="Enter your Details" labelPosition="center" my="lg" />

        <form onSubmit={form.onSubmit(handleFormSubmit)}>
          <Stack spacing="lg">
            {type === "Register" && (
              <TextInput
                required
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) =>
                  form.setFieldValue("name", event.currentTarget.value)
                }
                radius="md"
                variant="filled"
                color="purple"
              />
            )}

            <TextInput
              required
              label="Email"
              placeholder="hello@mantine.dev"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Invalid email"}
              radius="md"
              variant="filled"
              color="light-purple"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "Password should include at least 6 characters"
              }
              radius="md"
              variant="filled"
              color="light-purple"
            />

            {type === "Register" && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) =>
                  form.setFieldValue("terms", event.currentTarget.checked)
                }
                color="light-purple"
              />
            )}
          </Stack>

          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === "Register"
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Anchor>
            <Button
              type="submit"
              radius="xl"
              variant="gradient"
              color="light-purple"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
}

export default Login;
