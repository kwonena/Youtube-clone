import { render, screen } from "@testing-library/react";
import { Route, useLocation } from "react-router-dom";
import renderer from "react-test-renderer";
import VideoCard from "../VideoCard";
import { formatAgo } from "../../util/date";
import userEvent from "@testing-library/user-event";
import { fakeVideo as video } from "../../tests/videos";
import { withRouter } from "../../tests/utils";

describe("VideoCard", () => {
  const { title, channelTitle, publishedAt, thumbnails } = video.snippet;

  it("renders grid type", () => {
    const component = renderer.create(
      withRouter(<Route path="/" element={<VideoCard video={video} />} />)
    );

    expect(component.toJSON()).toMatchSnapshot();
  });

  it("renders list type", () => {
    const component = renderer.create(
      withRouter(
        <Route path="/" element={<VideoCard video={video} type="list" />} />
      )
    );

    expect(component.toJSON()).toMatchSnapshot();
  });

  it("renders video item", () => {
    render(
      withRouter(<Route path="/" element={<VideoCard video={video} />} />)
    );

    const image = screen.getByRole("img");
    expect(image.src).toBe(thumbnails.medium.url);
    expect(image.alt).toBe(title);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(channelTitle)).toBeInTheDocument();
    expect(screen.getByText(formatAgo(publishedAt))).toBeInTheDocument();
  });

  it("navigates to detailed video", async () => {
    function LocationStateDisplay() {
      return <pre>{JSON.stringify(useLocation().state)}</pre>;
    }
    render(
      withRouter(
        <>
          <Route path="/" element={<VideoCard video={video} />} />
          <Route
            path={`/videos/watch/${video.id}`}
            element={<LocationStateDisplay />}
          />
        </>
      )
    );

    const card = screen.getByRole("listitem");
    await userEvent.click(card);

    expect(screen.getByText(JSON.stringify({ video }))).toBeInTheDocument();
  });
});
