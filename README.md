# HeyMate

Hi, welcome to HeyMate! This is a website aiming at helping students from the University of Auckland find teammates for their courses or organizing activities for other students to participate in, strengthening interaction and cooperation on campus.
This project contains several pages and various components; please feel free to try them.


Group member:

- Xinran Wang
- Tianle Pan
- Ryan Wu
- Chelsea Huang
- Zhaohua Li
- Luming Jin

# Quick Link

If you want to see what our website looks like, follow this link :

[http://ec2-3-105-229-98.ap-southeast-2.compute.amazonaws.com](http://ec2-3-105-229-98.ap-southeast-2.compute.amazonaws.com/)

# Main Feature

## Login & Signup

Users can register their accounts using their email address and password. To ensure utmost security, we've implemented bcrypt encryption for passwords, making them highly secure. Once you create an account, you will automatically generate an avatar.

Furthermore, users have the option to register or log in directly using their Google account. It's important to note that we've restricted Google account authentication to users affiliated with the University of Auckland. This means only Google accounts associated with UoA can be used to log in, which guarantees the purity of our user cluster.

## Home

The home page is mainly for displaying the various groups that are created by students. We place a search bar for users to find the groups they are interested in. Type in keywords and press "search," which will redirect you to the search page, where it can show the related groups with their keywords in the title highlighted.

Groups are categorized into two types: Group, which is academic-related, and Activity. In each section, we place six groups at most, and only the group that is "available" will be displayed. Click on the title of the group, which will take you to the group information page.

If you would like to explore more groups, you can click the "more" link on the right-hand side of the page or directly press the "search" button.

You can notice group information is displayed in the form of a gallery card, which contains the group title, content, members, and so on. If you are a logged-in user, you can like or join the group.

We also designed a recommendation section for users to provide group recommendations according to the user's preferences, and this will be related to the favorite number of the group, the number of existing group members, the expiration time, and whether the user's personal tags match the group's tags.

### Like group

The like group function can let you keep this group in your like group list, where you can check it on your user page so you can apply it later on.

### Join Group

Joining a group means you send an application with a message to the host of the group. Hosts will receive a notification about you, and they can choose to accept you or reject you. You can trace your applied group on the user page.

Once your application is accepted, you will receive a notification, and you can check the group in the participation group list on the user page.

## Group information page

This page will display the details of the page, including title, group type, create time, deadline, number of people wanted, group tags, content, current members and applicants, and so on.

A logged-in user is able to join and like the group from this page, or they can cancel the application or like it if they want. A host of the group can accept and reject an applicant, and they can delete the current member one at a time. If you are a current member, you can also quit the group.

All the groups have a status with the default value "available." If you are a host, you can dismiss the group if you think you won't be able to gather enough people before the deadline or don't need this group anymore. This will make the group status "dismissed." If you have gathered enough teammates for your project, the group will be "full" and won't be able to accept new applicants. If the deadline has passed, you can close the group.

The host is able to update the group details by clicking "edit group," such as changing the number of people wanted or content.

## Search

The search page is used to search for groups that match the keyword. The strings in the search box are split into keywords by space and matched in the group name and group tag. The matched keywords in the group name are highlighted. The search results are divided into groups and activities, which can be toggled between tabs. Clicking on a specific group will take you to the group information page.

## Create groups

Users can create groups by clicking the button in the header nav bar. There is a restriction that the host should verify his account by choosing the Google accounts associated with UoA first, so every group owner will be a UoA student. You can customize your group title, deadline date (when you want to finish recruiting), number of people, content, and group tags.

Other users use group tags to give them a clear idea of the group content. We added an AI tag function here, so when the host clicks it, it is able to automatically generate related tags according to the group content that has been typed in. Neat and easy!

## User page

From the nav bar, you can enter your user page by clicking the avatar. It contains several subpages to go. You can view your general profile, such as name, email, tags, and the groups you are currently participating (including the groups you own) on the public profile page.

The account setting page can let you change your personal details such as username, gender, password, and tags. Adding tags can let you be noticed by others easily. To change the user's avatar, we introduced API from Dicebear so the user could randomly generate interesting avatars. Links:

[DiceBear | Open Source Avatar Library](https://www.dicebear.com/)

If your account is created through Google, you won't be able to access your password. If you used your own email to create an account, you will be asked to verify your account on this page, and only choosing your UoA Google account can successfully verify your account. You can also delete your account from this page, so everything related to you will be deleted from our database.

The user page also displays the groups you are currently applying for and liking. Clicking the groups will take you to the corresponding group information page.

Whenever someone applies/quits your group, your application is accepted/rejected, and the group you are participating in is dismissed/closed/updated. You will receive a notification that will take you to the corresponding group page. Your unread notification will be displayed as a red dot with a number in it as a reminder.

For subpages other than the user profile page, if you are viewing other people's user pages, you won't be able to access them due to privacy.

# MERN and Project management

## Database

This project uses MongoDB as the backend database, which is a document-based NoSQL database ideal for rapid development and handling large-scale data. The reasons we chose MongoDB include its flexible document structure, powerful querying capabilities, and efficient scalability. We took advantage of MongoDB's advanced features, such as triggers and indexes, to optimize data manipulation and improve application performance. We set up a trigger to automatically update the status of outdated groups to keep the data current and accurate.

## Project management

Our project management approach integrates various tools to ensure efficient collaboration and streamlined workflow. We utilize JIRA for comprehensive project management, complemented by Notion for document management. Additionally, we leveraged Figma for UI/UX design during the initial phases of the project.

We divided our duties from the beginning, and people were responsible for doing a full stack development for their own pages. Ryan is our project manager and is in charge of progress, meeting arrangements, and deployment. Apart from the basic functions on the page, we also have Xinran design the MongoDB database schema and Atlas connection, and Zhaohua and Kelvin work on the open API integration and machine learning models.

As a team, we basically have a group meeting once or twice a week (usually an offline meeting on Tuesday and an online meeting on Saturday) to discuss the progress we made, merge codes, and plan for the incoming tasks.

### Github

In our project, we leverage GitHub as our primary platform for version control, collaborative development, and code integration. With Git, we can create branches, commit changes, and merge code seamlessly, ensuring a structured and organized approach to code management. By utilizing Git's branching model, we can work on new features or bug fixes in isolation without impacting the stability of the main codebase.

### **JIRA**

JIRA serves as our central hub for managing tasks, tracking progress, and facilitating communication among team members. With JIRA, we can easily create and assign tasks, set deadlines, and monitor their status throughout the project lifecycle.

JIRA link:

https://hey-mate001.atlassian.net/jira/software/projects/SCRUM/boards/1?atlOrigin=eyJpIjoiYTczMTRiNTExZTM0NDUxMzk5MTYxY2UzMDM5YjNiMzAiLCJwIjoiaiJ9

### **Notion**

Notion acts as our repository for project documentation, providing a collaborative workspace where team members can create, organize, and share various types of documents. From meeting minutes and design specifications to technical documentation and user guides, Notion offers a versatile platform for storing and accessing essential project information.

Notion link:

[https://www.notion.so/Teamspace-Home-dd04eabd68f64b2991c18e268330a44e?pvs=4](https://www.notion.so/Teamspace-Home-dd04eabd68f64b2991c18e268330a44e?pvs=21)

### **Figma**

During the initial stages of the project, we utilized Figma to conceptualize and design the user interface and experience. Figma's cloud-based design platform enables real-time collaboration, allowing multiple team members to work on designs simultaneously and provide feedback in a visually rich environment.

Figma link:
https://www.figma.com/file/KSlK8CWejPgMDMaLSnUKHT/732-project?type=design&node-id=0-1&mode=design&t=TwzwHA0tjhxQ7Mtm-0

## Framework

In our project, we've adopted the MERN stack, a powerful combination of technologies for building full-stack web applications. MERN stands for MongoDB, Express.js, React.js, and Node.js, each serving a specific role in the development process.

For styling our user interface, we've opted for Tailwind CSS, a utility-first CSS framework that offers a unique approach to styling web applications. Unlike traditional CSS frameworks that provide pre-defined components and styles, Tailwind CSS provides a set of utility classes that can be applied directly to HTML elements to achieve desired styles.

## Machine learning model

To implement group recommendation based on the similarity between individual tags and group tags, we introduce a large language pre-trained model, Bert(from huggingface), to calculate the similarity between tags. BERT is a model based on Transformer, which learns rich language representations through large-scale unsupervised pre-training. Word similarity calculation is one of its downstream applications, which has high accuracy and can effectively capture semantic relationships between words. This module is developed in Python and uses the Flask framework to implement web services.

## API

1. We introduce DiceBear API to help the user generate their avatar. Link: [DiceBear | Open Source Avatar Library](https://www.dicebear.com/)
2. Our application integrates Google OAuth2.0 for user authentication, providing a streamlined and secure process for account creation and login. This method supports the verification of users' affiliations with the University of Auckland (UOA), ensuring that only students and staff can access certain application features.
3. We use the Azure OpenAI API. This powerful tool allows us to automate generating tags based on the group's description content, making the user experience smoother and more engaging. To ensure that the API serves our specific needs, we went a step further by customizing a prompt template. This tailored template ensures that the generated output aligns with the context of our application, providing a more personalized and effective service to our users.

## Testing

Jest serves as our primary testing framework for backend components. Known for its simplicity and flexibility, Jest provides a comprehensive suite of testing utilities tailored for JavaScript projects. With Jest, we can effortlessly write and execute unit tests, integration tests, and end-to-end tests for our backend services and APIs.

On the front end side, we rely on Vitest to test our user interface components and interactions.

By combining Jest for backend testing and Vitest for frontend testing, we adopt a holistic approach to testing that covers both server-side and client-side components of our application. Through automated testing, continuous integration, and test-driven development practices, we strive to maintain high code quality, prevent regressions, and deliver a robust and resilient software product to our users.

## Deployment

Our project has deployed on Amazon Web Services (AWS) using the Elastic Compute Cloud (EC2). The application can be accessed via the following URL:

[http://ec2-3-105-229-98.ap-southeast-2.compute.amazonaws.com](http://ec2-3-105-229-98.ap-southeast-2.compute.amazonaws.com/)

# How to run and test

Option 1 is our link above. If you want to test on your local machine, follow these steps:

## Run on Local machine

1. Ensure your computer has installed Node.js and Python3.x.
2. Clone our project.
3. Please create `.env` files for the front end and back end, as referred to in the Google form that we submitted.
4. Please install all the dependencies by `npm install` in both frontend and backend folder.
    
    ```jsx
    cd /fronend
    npm install
    ```
    
5. To activate Python scripts, please refer to the [README.md](http://README.md) under `mlmodel` folder. 
6. Run frontend React in 1 terminal
    
    ```jsx
    npm run dev
    ```
    
7. Run backend Express in other terminal









# COMPSCI 732 / SOFTENG 750 project - Team Noble Narwhals

Welcome to the project! I look forward to seeing your progress and your final results this semester!

Your team members are:
- Xinran Wang
- Tianle Pan
- Ryan Wu
- Chelsea Huang
- Zhaohua Li
- Luming Jin

![](./group-image/Noble%20Narwhals.webp)




