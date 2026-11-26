import Page from "../Components/Page";
import { Timetable } from "../Components/Timetable";

// Timetable Page

interface TimetableProps {
  //setAllBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

function TimetablePage({ }: TimetableProps) {
  return (
    <Page>
        <h1>Your timetable</h1>
        <Timetable />
    </Page>
  );
};

export default TimetablePage;
