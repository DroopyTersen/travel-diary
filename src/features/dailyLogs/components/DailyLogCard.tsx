import React from "react";
import { Link, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { Img, TagsDisplay } from "core/components";
import { MemoriesDisplay, MemoriesPreview } from "./Memories";
import { BLURRED_PHOTOS } from "global/components";

interface Props {
  dailyLog: {
    id: number;
    date: string;
    tags: { tag: { name: string; id: number } }[];
    memories: string;
    photos?: {
      id: number;
      date: string;
      thumbnail: string;
    }[];
  };
  trip: {
    id: number;
    title: string;
    start: string;
  };
  getLink?: (dailyLog) => string;
}

const getRandomPhoto = (photos = []) => {
  if (!photos.length)
    return { thumbnail: "/images/mountain-road.thumbnail.jpg", blurred: BLURRED_PHOTOS.landscape };

  return photos[Math.floor(Math.random() * photos.length)];
};
export function DailyLogCard({ dailyLog, trip, getLink = ({ id }) => `/dailylogs/${id}` }: Props) {
  const randomPhoto = getRandomPhoto(dailyLog.photos);
  console.log("🚀 | DailyLogCard | randomPhoto", randomPhoto);
  return (
    <Link to={getLink(dailyLog)}>
      <div className="card daily-log-card">
        <h2 className="dailyLog-title">
          <span className="day">{dayjs(dailyLog.date).format("ddd")}</span>
          <span className="date">{dayjs(dailyLog.date).format("M/DD/YYYY")}</span>
        </h2>
        <div className="row-two">
          <div className="photo">
            <Img src={randomPhoto.thumbnail} initial={randomPhoto.blurred} opacity={0.8} />
          </div>
          <div className="column-two">
            <div className="day-count">
              Day {dayjs(dailyLog.date).diff(dayjs(trip?.start), "day") + 1}
            </div>
            <div className="places">Places will go here</div>
            <TagsDisplay tags={dailyLog.tags} />
          </div>
        </div>
        {/* <MemoriesPreview
          memories={dailyLog.memories.slice(0)}
          className="preview"
        ></MemoriesPreview> */}
      </div>
    </Link>
  );
}
