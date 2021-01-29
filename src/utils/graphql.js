import { gql } from '@apollo/client';

const COMMENT_FRAGMENT = gql`
  fragment FeedPageComment on Comment {
    id
    note
    author{
      id
      profilePictureURL
      first
      last
      username
    }
    likeList{
      user{
        id
      }
    }
    createdAt
  }
`;

const EQUIPMENT_FRAGMENT = gql`
  fragment EquipmentData on Equipment {
    id
    name
    type
    usage{
      value
      unit
    }
    limit {
      value
      unit
    }
    active
    createdAt
  }
`;

export const POST_FRAGMENT = gql`
  fragment FeedPagePost on Post {
    id
    title
    note
    postDate
    author {
      id
      username
      first
      last
      profilePictureURL
    }
    activityList {
      id
      type
      duration
      distance {
        value
        unit
      }
      equipment{
        ...EquipmentData
      }
      additionalInfo{
        averageHeartRate
        elevationGain
        calories
      }
    }
    likeList {
      user{
        id
      }
    }
    commentList {
      ...FeedPageComment
    }
    createdAt
  }
  ${COMMENT_FRAGMENT},
  ${EQUIPMENT_FRAGMENT}
`;

export const GET_POST_QUERY = gql`
  query getPostList($pageSize: Int, $after:String){
    postList(pageSize: $pageSize, after:$after) @connection(key: "feed", filter: ["type"]) {
      cursor
      hasMore
      posts {
        ...FeedPagePost
      }
    }
  }
  ${POST_FRAGMENT}
`;

export const UPDATE_POST_MUTATION = gql`
  mutation updatePost($input: UpdatePostInput!){
    updatePost(input: $input){
      ...FeedPagePost
    }
  }
  ${POST_FRAGMENT}
`;

export const CREATE_POST_MUTATION = gql`
  mutation createPost($input: CreatePostInput!) {
    createPost(input: $input) {
      ...FeedPagePost
    }
  }
  ${POST_FRAGMENT}
`;

export const GET_POST_BY_ID_QUERY = gql`
  query getPost($id: ID!){
    post(id: $id){
      ...FeedPagePost
    }
  }
  ${POST_FRAGMENT}
`;

const TEAM_FRAGMENT = gql`
  fragment TeamData on Team {
    id
    name
    private
    description
    profilePictureURL
    memberCount
    owner {
      id
    }
  }
`;
export const CREATE_TEAM_MUTATION = gql`
  mutation createTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      ...TeamData
    }
  }
  ${TEAM_FRAGMENT}
`;

export const TEAM_QUERY = gql`
  query getTeam($id: ID!){
    team(id: $id) {
      ...TeamData
      createdAt
      memberList {
        id
      }
    }
  }
  ${TEAM_FRAGMENT}
`;

const PROFILE_FRAGMENT = gql`
  fragment ProfileData on User {
    id
    email
    first
    last
    username
    profilePictureURL
    birthdate
    bio
    private
    createdAt
    followerList {
      id
    }
    followingList {
      id
    }
    equipmentList {
      ...EquipmentData
    }
    teamList {
      ...TeamData
    }
  }
  ${EQUIPMENT_FRAGMENT}
  ${TEAM_FRAGMENT}
`;

export const ME_QUERY = gql`
  query {
    me {
      ...ProfileData
    }
  }
  ${PROFILE_FRAGMENT}
`;

export const UPDATE_USER_MUTATION = gql`
  mutation updateUser($input: UpdateUserInput!) {
        updateUser(input: $input) {
          ...ProfileData
        }
      }
      ${PROFILE_FRAGMENT}
    `;

export const USER_QUERY = gql`
  query getUser($id: ID!){
    user(id: $id){
      ...ProfileData
    }
  }
  ${PROFILE_FRAGMENT}
`;

export const UPDATE_EQUIPMENT_MUTATION = gql`
  mutation updateEquipment($input: UpdateEquipmentInput!) {
    updateEquipment(input: $input) {
      ...EquipmentData
    }
  }
  ${EQUIPMENT_FRAGMENT}
`;

export const CREATE_EQUIPMENT_MUTATION = gql`
  mutation createEquipment($input: CreateEquipmentInput!) {
    createEquipment(input: $input) {
      ...EquipmentData
    }
  }
  ${EQUIPMENT_FRAGMENT}
`;

const NOTIFICATION_FRAGMENT = gql`
  fragment NotificationData on Notification {
    id
    sender {
      id
      username
      first
      last
      profilePictureURL
    }
    team {
      id
      name
      profilePictureURL
    }
    message
    responseRequired
    type
    read
    post {
      id
      title
    }
    comment {
      id
      note
    }
  }
`;

export const UPDATE_NOTIFICATION = gql`
  mutation updateNotification($input: UpdateNotificationInput!){
    updateNotification(input: $input){
      ...NotificationData
    }
  }
  ${NOTIFICATION_FRAGMENT}
`;

export const NOTIFICATION_QUERY = gql`
  query {
    me {
      id
      notificationList {
        ...NotificationData
      }
    }
  }
  ${NOTIFICATION_FRAGMENT}
`;

export const FOLLOWER_STATUS_QUERY = gql`
  query getFollowStatus($userId: ID!) {
    getFollowStatus(userId: $userId) {
      pending
      following
      private
    }
  }
`;

export const USER_CALENDAR_QUERY = gql`
  query CALENDAR_POSTS($userId: ID, $date: String){
      getProfileCalendar(userId: $userId, date: $date){
          id
          title
          postDate
          activityList {
              id
              type
              duration
              distance {
                  unit
                  value
              }
          }
      }
  }
`;
