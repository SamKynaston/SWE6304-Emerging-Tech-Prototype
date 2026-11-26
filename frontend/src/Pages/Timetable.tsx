import Page from "../Components/Page";
import { Timetable } from "../Components/Timetable";

// Home Page

interface TimetableProps {
  //setAllBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

function TimetablePage({ }: TimetableProps) {
  return (
    <Page>
      <Timetable />
    </Page>
  );
};

export default TimetablePage;
