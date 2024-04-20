import React from "react";
import backgroundImage from "../../public/image/homePage_search_bg.jpg";
import LongSearchingBar from "../components/LongSearchingBar";
import Gallery from "../components/Gallery";

function HomePage() {
  const dummyData = [
    {
      title: "Let's test",
      id: "1kes",
      dayNum: 5,
      isFavorite: true,
      imageLink: [
        "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      ],
      num: 5,
      description:
        "Type in the group name or course name you are looking for. Type in the group name or course name you are looking for. Type in the group name or course name you are looking for. Type in the group name or course name you are looking for.",
    },
    {
      title: "Go to fishing",
      id: "4hjdh",
      dayNum: 1,
      isFavorite: false,
      imageLink: [
        "https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk",
        "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
        "https://eu.ui-avatars.com/api/?name=John+Doe&size=250",
        "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=mail@ashallendesign.co.uk",
        "https://robohash.org/mail@ashallendesign.co.uk",
      ],
      num: 5,
      description:
        "Type in the group name or course name you are looking for. Type in the group name or course name you are looking for. Type in the group name or course name you are looking for. Type in the group name or course name you are looking for.",
    },
    {
      title: "Final lucky",
      id: "3hjdh",
      dayNum: 3,
      isFavorite: true,
      imageLink: [
        "https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk",
        "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
        "https://eu.ui-avatars.com/api/?name=John+Doe&size=250",
        "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=mail@ashallendesign.co.uk",
        "https://robohash.org/mail@ashallendesign.co.uk",
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      ],
      num: 6,
      description:
        "Type in the group name or course name you are looking for. Type in the group name or course name you are looking for. Type in the group name or course name you are looking for. Type in the group name or course name you are looking for.",
    },
  ];
  return (
    <>
      <div id="main_content" className="">
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
            <h1 className="text-sky-800 my-4">
              <b className="text-4xl">Need Group/ Activities?</b>
            </h1>
            <p className="text-lg font-black text-sky-700 mb-4">
              Type in the group name, course name, find your group!
            </p>
            <div className="w-1/2">
              <LongSearchingBar />
            </div>
          </div>
        </div>
        <Gallery name="Recommendation" data={dummyData} />
        <Gallery name="Groups" data={dummyData} />
        <Gallery name="Activities" data={dummyData} />
      </div>
    </>
  );
}

export default HomePage;
