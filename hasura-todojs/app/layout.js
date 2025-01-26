import Header from "@/components/Header";
import ApolloProviderWrapper from "@/lib/ApolloProviderWrapper";

export const metadata = {
  title: "ToDoFlow",
  description: "A simple to-do app using Next.js and Hasura",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ApolloProviderWrapper>
          <Header />
          {children}
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}
