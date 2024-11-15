import React, { useMemo, useState } from "react";
import {
  Stack,
  Box,
  Text,
  Alert,
  Divider, Title, Anchor
} from "@mantine/core";
import { useOptions } from "../../../../../context/data.context";
import { defaultOptions, publicApiDetails } from "../../../../../constants/constants";

// TODO: Fix Vite HMR with named function components and name this component properly
// eslint-disable-next-line react/display-name
export default function () {
  const { publicApiUsage, options } = useOptions();

  const [showGuide, setShowGuide] = useState<boolean>(false);
  const isFreeSearchesDone = publicApiUsage >= publicApiDetails.usageLimitPerInstall;

  // Evaluate only once on component mount
  const isUsingFreeApiDetails = useMemo(() => options?.apiKey === defaultOptions.apiKey, []);

  return (
    <Box className="guide">
      {!isUsingFreeApiDetails && !showGuide && (
        <Anchor onClick={() => setShowGuide(true)} c="orange" underline="never" fw="bold">
          How to get an API key?
        </Anchor>
      )}

      {(isUsingFreeApiDetails || showGuide) && (
        <Stack gap="xs">
          <Text>
            <Text c="orange" component="strong" fw="bold">Important: </Text>
            This extension uses Merriam-Webster's free API services. Therefore you need your own free API key before
            reaching the limits.
          </Text>
          <Title order={5} c="orange">How to get a Free API key?</Title>
          <ol style={{ margin: 0 }}>
            <li>
              <Text>
                Visit
                {" "}
                <Anchor href="https://dictionaryapi.com/register/index" target="_blank" rel="noreferrer">
                  dictionaryapi.com
                </Anchor>
                {" "}
                to register for a free account. To make it easier, you can click on the "Make registration simpler"
                button to autofill some fields
              </Text>
            </li>
            <li>
              <Text>
                In the registration form, select the types of dictionaries you want access to.
              </Text>
              <Text>
                If you don't know which dictionary fits your needs, you can
                {" "}
                <Anchor href="https://dictionaryapi.com/products/index" target="_blank" rel="noreferrer">
                  read their details here
                </Anchor>
                .
              </Text>
            </li>
            <li>
              <Text>
                After registration, go to the
                {" "}
                <Anchor href="https://dictionaryapi.com/account/my-keys" target="_blank" rel="noreferrer">
                  Your keys
                </Anchor>
                {" "}
                page in the website and copy the API key you want to use with this extension and paste it into the form
                below.
              </Text>
            </li>
          </ol>
          {isUsingFreeApiDetails && !isFreeSearchesDone && (
            <Alert variant="light" color="blue">
              {`${publicApiUsage} out of ${publicApiDetails.usageLimitPerInstall} free searches have been consumed!`}
            </Alert>
          )}

          {isUsingFreeApiDetails && isFreeSearchesDone && (
            <Alert variant="light" color="blue" title="Free searches have been consumed!">
              You've reached the limit of using public options. You need to add your FREE personal API key to continue
              using this extension.
            </Alert>
          )}
          <Divider />
        </Stack>
      )}
    </Box>
  );
};
