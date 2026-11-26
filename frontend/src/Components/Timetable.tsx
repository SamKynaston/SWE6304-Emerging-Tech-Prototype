const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const HOURS = Array.from({ length: 11 }, (_, index) => 8 + index);

function getPosition(hour: number): string {
  return `${((hour - 8) / 10) * 100}%`;
}

export function Timetable() {
  return (
    <section aria-label="Weekly timetable" className="overflow-x-auto">
      <div className="min-w-[48rem]">
        <div className="grid grid-cols-[4rem_repeat(5,minmax(0,1fr))]">
          <div aria-hidden="true" />
          {DAYS.map((day) => (
            <h2 key={day} className="p-2 text-center font-semibold">
              {day}
            </h2>
          ))}
        </div>

        <div className="grid grid-cols-[4rem_repeat(5,minmax(0,1fr))]">
          <div className="relative h-[600px] text-right text-sm">
            {HOURS.map((hour) => (
              <span
                key={hour}
                className={`absolute right-2 ${
                  hour === 8 ? "" : hour === 18 ? "-translate-y-full" : "-translate-y-1/2"
                }`}
                style={{ top: getPosition(hour) }}
              >
                {`${String(hour).padStart(2, "0")}:00`}
              </span>
            ))}
          </div>

          {DAYS.map((day) => (
            <div key={day} className="relative h-[600px] border-l">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  aria-hidden="true"
                  className="absolute w-full border-t border-stone-300"
                  style={{ top: getPosition(hour) }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}