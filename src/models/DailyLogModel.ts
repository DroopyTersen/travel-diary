import { generateId } from "../core/utils";
import dayjs from "dayjs";
import { TripModel, NEW_TRIP } from "./TripModel";
import slugify from "slugify";
import { createIdbStore } from "../services/idb";
export interface DailyLogItem {
  id?: string;
  timestamp?: number;
  authorId: string;
  date: string;
  highlights: string[];
  tags: string[];
  // companionIds?: string[];
  placeIds?: string[];
  imageIds?: string[];
}

export const NEW_DAILY_LOG = {
  id: generateId(),
  // TODO: replace with current user
  authorId: "Drew",
  date: dayjs().startOf("day").format("YYYY-MM-DD"),
  highlights: [],
  tags: [],
  // companionIds: [],
  placeIds: [],
  imageIds: [],
};

export class DailyLogModel {
  item: DailyLogItem;
  constructor(item: DailyLogItem = NEW_DAILY_LOG) {
    this.item = item;
  }
  static async loadByTrip(tripId) {
    if (!tripId) return Promise.resolve([]);
    let trip = await TripModel.load(tripId);
    // TODO: switch to query by dates?
    let items = await createIdbStore<DailyLogItem>("dailyLogs").getAll();
    console.log("DailyLogModel -> loadByTrip -> items", items);
    let tripLogs = items
      .filter((logItem) => {
        return logItem.date >= trip.item.start && logItem.date <= trip.item.end;
      })
      .map((item) => new DailyLogModel(item));
    return tripLogs;
  }
  static async load(id) {
    if (!id) return new DailyLogModel();
    let item = await createIdbStore<DailyLogItem>("dailyLogs").getById(id);
    if (!item) throw new Error("Daily Log not found: " + id);
    return new DailyLogModel(item);
  }
  static async loadByDate(date: string | Date) {
    let items = await createIdbStore<DailyLogItem>("dailyLogs").getAll();
    let match = items.find((item) => dayjs(item.date).isSame(dayjs(date)));
    if (match) {
      return new DailyLogModel(match);
    }
    let newItem = { ...NEW_DAILY_LOG };
    newItem.date = dayjs(date).format("YYYY-MM-DD");
    return new DailyLogModel(newItem);
  }
  update(key, value) {
    this.item[key] = value;
  }
  checkIsValid(): boolean {
    return this.item.date && this.item.highlights && this.item.highlights.length > 0;
  }
  get title(): string {
    return dayjs(this.item.date).format("ddd M/DD/YYYY");
  }
  async save() {
    // TODO: delete any logs that already exists for that date (local and DB)
    // TODO: handle places.
    // If the Place doesn't exist, add to the Places store
    // Add the visit date (make sure not duplicate)
    console.log("DAILY LOG SAVE", this.item);
    this.item.timestamp = Date.now();
    if (this.checkIsValid()) {
      await createIdbStore("dailyLogs").save(this.item);
      await createIdbStore("outbox").save({
        action: "dailyLogs.save",
        payload: this.item,
        date: new Date(),
      });
      window.swRegistration.sync.register("dailyLogs.save");
    }
  }
  async remove() {
    await createIdbStore("dailyLogs").remove(this.item.id);
    await createIdbStore("outbox").save({
      action: "dailyLogs.remove",
      payload: this.item,
      date: new Date(),
    });
    window.swRegistration.sync.register("dailyLogs.remove");
  }
}
