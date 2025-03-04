import { render } from "@testing-library/react";
import App from "../../pages/_app";
import type { AppProps } from "next/app";
import MockRouter from "next-router-mock";

jest.mock('~/styles/globals.css', () => ({}));

jest.mock("next/router", () => ({
  __esModule: true,
  ...jest.requireActual("next-router-mock"),
  default: MockRouter,
  useRouter: () => MockRouter
}));

describe("_app", () => {
  it("renders the page component correctly", () => {
    MockRouter.push("/");

    const MockComponent = () => <div>Test Page</div>;

    const mockAppProps: AppProps = {
      Component: MockComponent,
      pageProps: {},
      router: MockRouter as any,
    };

    const { getByText } = render(<App {...mockAppProps} />);

    expect(getByText("Test Page")).toBeInTheDocument();
  });
}); 