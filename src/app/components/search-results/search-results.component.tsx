import { BookingResponse } from "@/types/booking";
import { Rooms } from "@/utils/composition.service";
import DisplayResultComponent from "../display-result/display-result.component";

async function getData(params: { [key: string]: string | string[] | undefined }) {
  const body = {
    bookingType: params.bookingType,
    direct: false,
    location: params.location,
    departureDate: params.departureDate,
    duration: params.duration,
    gateway: params.gateway,
    partyCompositions: Rooms.parseAndConvert([params.partyCompositions as string]),
  };

  const res = await fetch(
    "https://www.virginholidays.co.uk/cjs-search-api/search",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function SearchResultsComponent({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const req = await getData(searchParams);
  const results: BookingResponse = req;

  return (
    <section>
      <DisplayResultComponent holidays={results.holidays} />
    </section>
  );
}
