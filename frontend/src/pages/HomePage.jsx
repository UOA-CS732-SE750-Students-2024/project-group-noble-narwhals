import React from "react";
import backgroundImage from "../assets/group-discussion.svg";
import LongSearchingBar from "../components/LongSearchingBar";

function HomePage() {
  return (
    <>
      <div id="main_content" className="mx-auto w-4/5 max-w-main_content">
        <div
          className="bg-cover bg-center flex flex-col items-center justify-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            // backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#f5f5f5",
            height: "50vh",
          }}
        >
          {/* Blurred overlay div */}
          <div className="w-full h-full bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-sky-800 my-4">
              Need Group/ Activities?
            </h1>
            <p className="text-lg font-bold text-sky-700 mb-4">
              Type in the group name, course name, find your group!
            </p>
            <LongSearchingBar />
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
