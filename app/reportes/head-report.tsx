import { FunctionComponent } from "react";


interface HeadReportProps {
  
}
 
const HeadReport: FunctionComponent<HeadReportProps> = () => {
  return (
    <div className="w-full flex flex-col items-center py-6 gap-4">
      <img src={"/logo.png"} width={200} height={150} />
      <div>
        
      </div>
    </div>
  );
}
 
export default HeadReport;