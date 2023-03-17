import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { GetServerSideProps } from "next";
import { FC, useEffect, useState } from "react";
import type { AppRouter } from "../../backend";

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:8080",
    }),
  ],
});

type Props = {
  name: string;
  greeting: string;
};

async function greet(name: string): Promise<string> {
  const response = await client.greeting.query({ name });
  return response.text;
}

const TopPage: FC<Props> = (props) => {
  const [name, setName] = useState(props.name);
  const [greeting, setGreeting] = useState(props.greeting);

  useEffect(() => {
    greet(name).then((g) => setGreeting(g));
  }, [name]);

  return (
    <div>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <div>{greeting}</div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const name = context.query.name?.toString() || "John";
  const greeting = await greet(name);
  return { props: { name, greeting } };
};

export default TopPage;
