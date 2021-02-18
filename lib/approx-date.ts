/**
 * Describes an approximate time in history.
 */
type ApproxDate = "PRESENT" | {
  year: number;
  month:
    | "Jan"
    | "Feb"
    | "Mar"
    | "Apr"
    | "May"
    | "Jun"
    | "Jul"
    | "Aug"
    | "Sep"
    | "Oct"
    | "Nov"
    | "Dec";
};

export default ApproxDate;
