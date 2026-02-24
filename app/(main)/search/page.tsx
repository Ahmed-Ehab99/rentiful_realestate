import { getProperties } from "@/lib/queries/property.queries";
import { parsePropertyFilters } from "@/lib/validations/property.validations";
import FiltersBar from "./_components/FiltersBar";
import FiltersFull from "./_components/FiltersFull";
import Listings from "./_components/Listings";
import PropertyMap from "./_components/PropertyMap";

const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const params = await searchParams;
  const filters = parsePropertyFilters(params);
  const properties = await getProperties(filters);
  const viewMode = params.view === "list" ? "list" : "grid";

  return (
    <div className="mx-auto flex h-[calc(100vh-3.25rem)] w-full flex-col px-5">
      <FiltersBar />
      <div className="mb-5 flex flex-1 flex-col justify-between gap-3 overflow-hidden md:flex-row">
        <FiltersFull />
        <PropertyMap properties={properties} />
        <div className="overflow-y-auto md:basis-5/12 scroll-none">
          <Listings searchParams={params} viewMode={viewMode} />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
