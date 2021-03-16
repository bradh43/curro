/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPostList
// ====================================================

export interface getPostList_postList_posts_author {
  id: string;
  username: string;
  first: string;
  last: string;
  profilePictureURL: string | null;
}

export interface getPostList_postList_posts_activityList_distance {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface getPostList_postList_posts_activityList_equipment_usage {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface getPostList_postList_posts_activityList_equipment_limit {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface getPostList_postList_posts_activityList_equipment {
  id: string;
  name: string;
  type: AllowedEquipment;
  usage: getPostList_postList_posts_activityList_equipment_usage | null;
  limit: getPostList_postList_posts_activityList_equipment_limit | null;
  active: boolean | null;
  createdAt: string;
}

export interface getPostList_postList_posts_activityList_additionalInfo {
  averageHeartRate: number | null;
  elevationGain: number | null;
  calories: number | null;
}

export interface getPostList_postList_posts_activityList {
  id: string;
  type: AllowedActivity;
  duration: number | null;
  distance: getPostList_postList_posts_activityList_distance | null;
  equipment: getPostList_postList_posts_activityList_equipment | null;
  additionalInfo: getPostList_postList_posts_activityList_additionalInfo | null;
}

export interface getPostList_postList_posts_likeList_user {
  id: string;
}

export interface getPostList_postList_posts_likeList {
  user: getPostList_postList_posts_likeList_user;
}

export interface getPostList_postList_posts_commentList_author {
  id: string;
  profilePictureURL: string | null;
  first: string;
  last: string;
  username: string;
}

export interface getPostList_postList_posts_commentList_likeList_user {
  id: string;
}

export interface getPostList_postList_posts_commentList_likeList {
  user: getPostList_postList_posts_commentList_likeList_user;
}

export interface getPostList_postList_posts_commentList {
  id: string;
  note: string;
  author: getPostList_postList_posts_commentList_author;
  likeList: getPostList_postList_posts_commentList_likeList[];
  createdAt: string;
}

export interface getPostList_postList_posts {
  id: string;
  title: string;
  note: string | null;
  postDate: string;
  author: getPostList_postList_posts_author;
  activityList: getPostList_postList_posts_activityList[];
  likeList: getPostList_postList_posts_likeList[];
  commentList: getPostList_postList_posts_commentList[];
  createdAt: string;
}

export interface getPostList_postList {
  cursor: string | null;
  hasMore: boolean;
  posts: getPostList_postList_posts[];
}

export interface getPostList {
  postList: getPostList_postList;
}

export interface getPostListVariables {
  pageSize?: number | null;
  after?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updatePost
// ====================================================

export interface updatePost_updatePost_author {
  id: string;
  username: string;
  first: string;
  last: string;
  profilePictureURL: string | null;
}

export interface updatePost_updatePost_activityList_distance {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface updatePost_updatePost_activityList_equipment_usage {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface updatePost_updatePost_activityList_equipment_limit {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface updatePost_updatePost_activityList_equipment {
  id: string;
  name: string;
  type: AllowedEquipment;
  usage: updatePost_updatePost_activityList_equipment_usage | null;
  limit: updatePost_updatePost_activityList_equipment_limit | null;
  active: boolean | null;
  createdAt: string;
}

export interface updatePost_updatePost_activityList_additionalInfo {
  averageHeartRate: number | null;
  elevationGain: number | null;
  calories: number | null;
}

export interface updatePost_updatePost_activityList {
  id: string;
  type: AllowedActivity;
  duration: number | null;
  distance: updatePost_updatePost_activityList_distance | null;
  equipment: updatePost_updatePost_activityList_equipment | null;
  additionalInfo: updatePost_updatePost_activityList_additionalInfo | null;
}

export interface updatePost_updatePost_likeList_user {
  id: string;
}

export interface updatePost_updatePost_likeList {
  user: updatePost_updatePost_likeList_user;
}

export interface updatePost_updatePost_commentList_author {
  id: string;
  profilePictureURL: string | null;
  first: string;
  last: string;
  username: string;
}

export interface updatePost_updatePost_commentList_likeList_user {
  id: string;
}

export interface updatePost_updatePost_commentList_likeList {
  user: updatePost_updatePost_commentList_likeList_user;
}

export interface updatePost_updatePost_commentList {
  id: string;
  note: string;
  author: updatePost_updatePost_commentList_author;
  likeList: updatePost_updatePost_commentList_likeList[];
  createdAt: string;
}

export interface updatePost_updatePost {
  id: string;
  title: string;
  note: string | null;
  postDate: string;
  author: updatePost_updatePost_author;
  activityList: updatePost_updatePost_activityList[];
  likeList: updatePost_updatePost_likeList[];
  commentList: updatePost_updatePost_commentList[];
  createdAt: string;
}

export interface updatePost {
  updatePost: updatePost_updatePost;
}

export interface updatePostVariables {
  input: UpdatePostInput;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createPost
// ====================================================

export interface createPost_createPost_author {
  id: string;
  username: string;
  first: string;
  last: string;
  profilePictureURL: string | null;
}

export interface createPost_createPost_activityList_distance {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface createPost_createPost_activityList_equipment_usage {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface createPost_createPost_activityList_equipment_limit {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface createPost_createPost_activityList_equipment {
  id: string;
  name: string;
  type: AllowedEquipment;
  usage: createPost_createPost_activityList_equipment_usage | null;
  limit: createPost_createPost_activityList_equipment_limit | null;
  active: boolean | null;
  createdAt: string;
}

export interface createPost_createPost_activityList_additionalInfo {
  averageHeartRate: number | null;
  elevationGain: number | null;
  calories: number | null;
}

export interface createPost_createPost_activityList {
  id: string;
  type: AllowedActivity;
  duration: number | null;
  distance: createPost_createPost_activityList_distance | null;
  equipment: createPost_createPost_activityList_equipment | null;
  additionalInfo: createPost_createPost_activityList_additionalInfo | null;
}

export interface createPost_createPost_likeList_user {
  id: string;
}

export interface createPost_createPost_likeList {
  user: createPost_createPost_likeList_user;
}

export interface createPost_createPost_commentList_author {
  id: string;
  profilePictureURL: string | null;
  first: string;
  last: string;
  username: string;
}

export interface createPost_createPost_commentList_likeList_user {
  id: string;
}

export interface createPost_createPost_commentList_likeList {
  user: createPost_createPost_commentList_likeList_user;
}

export interface createPost_createPost_commentList {
  id: string;
  note: string;
  author: createPost_createPost_commentList_author;
  likeList: createPost_createPost_commentList_likeList[];
  createdAt: string;
}

export interface createPost_createPost {
  id: string;
  title: string;
  note: string | null;
  postDate: string;
  author: createPost_createPost_author;
  activityList: createPost_createPost_activityList[];
  likeList: createPost_createPost_likeList[];
  commentList: createPost_createPost_commentList[];
  createdAt: string;
}

export interface createPost {
  createPost: createPost_createPost;
}

export interface createPostVariables {
  input: CreatePostInput;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPost
// ====================================================

export interface getPost_post_author {
  id: string;
  username: string;
  first: string;
  last: string;
  profilePictureURL: string | null;
}

export interface getPost_post_activityList_distance {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface getPost_post_activityList_equipment_usage {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface getPost_post_activityList_equipment_limit {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface getPost_post_activityList_equipment {
  id: string;
  name: string;
  type: AllowedEquipment;
  usage: getPost_post_activityList_equipment_usage | null;
  limit: getPost_post_activityList_equipment_limit | null;
  active: boolean | null;
  createdAt: string;
}

export interface getPost_post_activityList_additionalInfo {
  averageHeartRate: number | null;
  elevationGain: number | null;
  calories: number | null;
}

export interface getPost_post_activityList {
  id: string;
  type: AllowedActivity;
  duration: number | null;
  distance: getPost_post_activityList_distance | null;
  equipment: getPost_post_activityList_equipment | null;
  additionalInfo: getPost_post_activityList_additionalInfo | null;
}

export interface getPost_post_likeList_user {
  id: string;
}

export interface getPost_post_likeList {
  user: getPost_post_likeList_user;
}

export interface getPost_post_commentList_author {
  id: string;
  profilePictureURL: string | null;
  first: string;
  last: string;
  username: string;
}

export interface getPost_post_commentList_likeList_user {
  id: string;
}

export interface getPost_post_commentList_likeList {
  user: getPost_post_commentList_likeList_user;
}

export interface getPost_post_commentList {
  id: string;
  note: string;
  author: getPost_post_commentList_author;
  likeList: getPost_post_commentList_likeList[];
  createdAt: string;
}

export interface getPost_post {
  id: string;
  title: string;
  note: string | null;
  postDate: string;
  author: getPost_post_author;
  activityList: getPost_post_activityList[];
  likeList: getPost_post_likeList[];
  commentList: getPost_post_commentList[];
  createdAt: string;
}

export interface getPost {
  post: getPost_post | null;
}

export interface getPostVariables {
  id: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createTeam
// ====================================================

export interface createTeam_createTeam_owner {
  id: string;
}

export interface createTeam_createTeam {
  id: string;
  name: string;
  private: boolean | null;
  description: string | null;
  profilePictureURL: string | null;
  memberCount: number;
  owner: createTeam_createTeam_owner;
}

export interface createTeam {
  createTeam: createTeam_createTeam;
}

export interface createTeamVariables {
  input: CreateTeamInput;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateTeam
// ====================================================

export interface updateTeam_updateTeam_owner {
  id: string;
}

export interface updateTeam_updateTeam {
  id: string;
  name: string;
  private: boolean | null;
  description: string | null;
  profilePictureURL: string | null;
  memberCount: number;
  owner: updateTeam_updateTeam_owner;
}

export interface updateTeam {
  updateTeam: updateTeam_updateTeam;
}

export interface updateTeamVariables {
  input: UpdateTeamInput;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTeam
// ====================================================

export interface getTeam_team_owner {
  id: string;
}

export interface getTeam_team_adminList {
  id: string;
}

export interface getTeam_team_memberList {
  id: string;
}

export interface getTeam_team {
  id: string;
  name: string;
  private: boolean | null;
  description: string | null;
  profilePictureURL: string | null;
  memberCount: number;
  owner: getTeam_team_owner;
  createdAt: string;
  adminList: getTeam_team_adminList[];
  memberList: getTeam_team_memberList[];
}

export interface getTeam {
  team: getTeam_team | null;
}

export interface getTeamVariables {
  id: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ME
// ====================================================

export interface ME_me_followerList {
  id: string;
}

export interface ME_me_followingList {
  id: string;
}

export interface ME_me_equipmentList_usage {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface ME_me_equipmentList_limit {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface ME_me_equipmentList {
  id: string;
  name: string;
  type: AllowedEquipment;
  usage: ME_me_equipmentList_usage | null;
  limit: ME_me_equipmentList_limit | null;
  active: boolean | null;
  createdAt: string;
}

export interface ME_me_teamList_owner {
  id: string;
}

export interface ME_me_teamList {
  id: string;
  name: string;
  private: boolean | null;
  description: string | null;
  profilePictureURL: string | null;
  memberCount: number;
  owner: ME_me_teamList_owner;
}

export interface ME_me {
  id: string;
  email: string;
  first: string;
  last: string;
  username: string;
  profilePictureURL: string | null;
  birthdate: string | null;
  bio: string | null;
  private: boolean;
  createdAt: string;
  followerList: ME_me_followerList[];
  followingList: ME_me_followingList[];
  equipmentList: ME_me_equipmentList[];
  teamList: ME_me_teamList[];
}

export interface ME {
  me: ME_me;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateUser
// ====================================================

export interface updateUser_updateUser_followerList {
  id: string;
}

export interface updateUser_updateUser_followingList {
  id: string;
}

export interface updateUser_updateUser_equipmentList_usage {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface updateUser_updateUser_equipmentList_limit {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface updateUser_updateUser_equipmentList {
  id: string;
  name: string;
  type: AllowedEquipment;
  usage: updateUser_updateUser_equipmentList_usage | null;
  limit: updateUser_updateUser_equipmentList_limit | null;
  active: boolean | null;
  createdAt: string;
}

export interface updateUser_updateUser_teamList_owner {
  id: string;
}

export interface updateUser_updateUser_teamList {
  id: string;
  name: string;
  private: boolean | null;
  description: string | null;
  profilePictureURL: string | null;
  memberCount: number;
  owner: updateUser_updateUser_teamList_owner;
}

export interface updateUser_updateUser {
  id: string;
  email: string;
  first: string;
  last: string;
  username: string;
  profilePictureURL: string | null;
  birthdate: string | null;
  bio: string | null;
  private: boolean;
  createdAt: string;
  followerList: updateUser_updateUser_followerList[];
  followingList: updateUser_updateUser_followingList[];
  equipmentList: updateUser_updateUser_equipmentList[];
  teamList: updateUser_updateUser_teamList[];
}

export interface updateUser {
  updateUser: updateUser_updateUser;
}

export interface updateUserVariables {
  input: UpdateUserInput;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getUser
// ====================================================

export interface getUser_user_followerList {
  id: string;
}

export interface getUser_user_followingList {
  id: string;
}

export interface getUser_user_equipmentList_usage {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface getUser_user_equipmentList_limit {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface getUser_user_equipmentList {
  id: string;
  name: string;
  type: AllowedEquipment;
  usage: getUser_user_equipmentList_usage | null;
  limit: getUser_user_equipmentList_limit | null;
  active: boolean | null;
  createdAt: string;
}

export interface getUser_user_teamList_owner {
  id: string;
}

export interface getUser_user_teamList {
  id: string;
  name: string;
  private: boolean | null;
  description: string | null;
  profilePictureURL: string | null;
  memberCount: number;
  owner: getUser_user_teamList_owner;
}

export interface getUser_user {
  id: string;
  email: string;
  first: string;
  last: string;
  username: string;
  profilePictureURL: string | null;
  birthdate: string | null;
  bio: string | null;
  private: boolean;
  createdAt: string;
  followerList: getUser_user_followerList[];
  followingList: getUser_user_followingList[];
  equipmentList: getUser_user_equipmentList[];
  teamList: getUser_user_teamList[];
}

export interface getUser {
  user: getUser_user | null;
}

export interface getUserVariables {
  id: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateEquipment
// ====================================================

export interface updateEquipment_updateEquipment_usage {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface updateEquipment_updateEquipment_limit {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface updateEquipment_updateEquipment {
  id: string;
  name: string;
  type: AllowedEquipment;
  usage: updateEquipment_updateEquipment_usage | null;
  limit: updateEquipment_updateEquipment_limit | null;
  active: boolean | null;
  createdAt: string;
}

export interface updateEquipment {
  updateEquipment: updateEquipment_updateEquipment;
}

export interface updateEquipmentVariables {
  input: UpdateEquipmentInput;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createEquipment
// ====================================================

export interface createEquipment_createEquipment_usage {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface createEquipment_createEquipment_limit {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface createEquipment_createEquipment {
  id: string;
  name: string;
  type: AllowedEquipment;
  usage: createEquipment_createEquipment_usage | null;
  limit: createEquipment_createEquipment_limit | null;
  active: boolean | null;
  createdAt: string;
}

export interface createEquipment {
  createEquipment: createEquipment_createEquipment;
}

export interface createEquipmentVariables {
  input: CreateEquipmentInput;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateNotification
// ====================================================

export interface updateNotification_updateNotification_sender {
  id: string;
  username: string;
  first: string;
  last: string;
  profilePictureURL: string | null;
}

export interface updateNotification_updateNotification_team {
  id: string;
  name: string;
  profilePictureURL: string | null;
}

export interface updateNotification_updateNotification_post {
  id: string;
  title: string;
}

export interface updateNotification_updateNotification_comment {
  id: string;
  note: string;
}

export interface updateNotification_updateNotification {
  id: string;
  sender: updateNotification_updateNotification_sender | null;
  team: updateNotification_updateNotification_team | null;
  message: string;
  responseRequired: boolean | null;
  type: AllowedNotification;
  read: boolean;
  post: updateNotification_updateNotification_post | null;
  comment: updateNotification_updateNotification_comment | null;
}

export interface updateNotification {
  updateNotification: updateNotification_updateNotification | null;
}

export interface updateNotificationVariables {
  input: UpdateNotificationInput;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MY_NOTIFICATION_LIST
// ====================================================

export interface MY_NOTIFICATION_LIST_me_notificationList_sender {
  id: string;
  username: string;
  first: string;
  last: string;
  profilePictureURL: string | null;
}

export interface MY_NOTIFICATION_LIST_me_notificationList_team {
  id: string;
  name: string;
  profilePictureURL: string | null;
}

export interface MY_NOTIFICATION_LIST_me_notificationList_post {
  id: string;
  title: string;
}

export interface MY_NOTIFICATION_LIST_me_notificationList_comment {
  id: string;
  note: string;
}

export interface MY_NOTIFICATION_LIST_me_notificationList {
  id: string;
  sender: MY_NOTIFICATION_LIST_me_notificationList_sender | null;
  team: MY_NOTIFICATION_LIST_me_notificationList_team | null;
  message: string;
  responseRequired: boolean | null;
  type: AllowedNotification;
  read: boolean;
  post: MY_NOTIFICATION_LIST_me_notificationList_post | null;
  comment: MY_NOTIFICATION_LIST_me_notificationList_comment | null;
}

export interface MY_NOTIFICATION_LIST_me {
  id: string;
  notificationList: MY_NOTIFICATION_LIST_me_notificationList[];
}

export interface MY_NOTIFICATION_LIST {
  me: MY_NOTIFICATION_LIST_me;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getFollowStatus
// ====================================================

export interface getFollowStatus_getFollowStatus {
  pending: boolean;
  following: boolean;
  private: boolean;
}

export interface getFollowStatus {
  getFollowStatus: getFollowStatus_getFollowStatus;
}

export interface getFollowStatusVariables {
  userId: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CALENDAR_POSTS
// ====================================================

export interface CALENDAR_POSTS_getProfileCalendar_activityList_distance {
  unit: AllowedUnit | null;
  value: number | null;
}

export interface CALENDAR_POSTS_getProfileCalendar_activityList {
  id: string;
  type: AllowedActivity;
  duration: number | null;
  distance: CALENDAR_POSTS_getProfileCalendar_activityList_distance | null;
}

export interface CALENDAR_POSTS_getProfileCalendar {
  id: string;
  title: string;
  postDate: string;
  activityList: CALENDAR_POSTS_getProfileCalendar_activityList[];
}

export interface CALENDAR_POSTS {
  getProfileCalendar: CALENDAR_POSTS_getProfileCalendar[];
}

export interface CALENDAR_POSTSVariables {
  userId?: string | null;
  date?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TEAM_CALENDAR_POSTS
// ====================================================

export interface TEAM_CALENDAR_POSTS_getTeamCalendar_user {
  id: string;
  username: string;
}

export interface TEAM_CALENDAR_POSTS_getTeamCalendar_posts_activityList_distance {
  unit: AllowedUnit | null;
  value: number | null;
}

export interface TEAM_CALENDAR_POSTS_getTeamCalendar_posts_activityList {
  id: string;
  type: AllowedActivity;
  duration: number | null;
  distance: TEAM_CALENDAR_POSTS_getTeamCalendar_posts_activityList_distance | null;
}

export interface TEAM_CALENDAR_POSTS_getTeamCalendar_posts_likeList_user {
  id: string;
}

export interface TEAM_CALENDAR_POSTS_getTeamCalendar_posts_likeList {
  user: TEAM_CALENDAR_POSTS_getTeamCalendar_posts_likeList_user;
}

export interface TEAM_CALENDAR_POSTS_getTeamCalendar_posts_commentList_author {
  id: string;
  profilePictureURL: string | null;
  first: string;
  last: string;
  username: string;
}

export interface TEAM_CALENDAR_POSTS_getTeamCalendar_posts_commentList_likeList_user {
  id: string;
}

export interface TEAM_CALENDAR_POSTS_getTeamCalendar_posts_commentList_likeList {
  user: TEAM_CALENDAR_POSTS_getTeamCalendar_posts_commentList_likeList_user;
}

export interface TEAM_CALENDAR_POSTS_getTeamCalendar_posts_commentList {
  id: string;
  note: string;
  author: TEAM_CALENDAR_POSTS_getTeamCalendar_posts_commentList_author;
  likeList: TEAM_CALENDAR_POSTS_getTeamCalendar_posts_commentList_likeList[];
  createdAt: string;
}

export interface TEAM_CALENDAR_POSTS_getTeamCalendar_posts {
  id: string;
  title: string;
  note: string | null;
  postDate: string;
  activityList: TEAM_CALENDAR_POSTS_getTeamCalendar_posts_activityList[];
  likeList: TEAM_CALENDAR_POSTS_getTeamCalendar_posts_likeList[];
  commentList: TEAM_CALENDAR_POSTS_getTeamCalendar_posts_commentList[];
}

export interface TEAM_CALENDAR_POSTS_getTeamCalendar {
  user: TEAM_CALENDAR_POSTS_getTeamCalendar_user | null;
  posts: TEAM_CALENDAR_POSTS_getTeamCalendar_posts[];
}

export interface TEAM_CALENDAR_POSTS {
  getTeamCalendar: TEAM_CALENDAR_POSTS_getTeamCalendar[];
}

export interface TEAM_CALENDAR_POSTSVariables {
  teamId: string;
  date?: string | null;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ME_EQUIPMENT
// ====================================================

export interface ME_EQUIPMENT_me_equipmentList_usage {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface ME_EQUIPMENT_me_equipmentList_limit {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface ME_EQUIPMENT_me_equipmentList {
  id: string;
  name: string;
  type: AllowedEquipment;
  usage: ME_EQUIPMENT_me_equipmentList_usage | null;
  limit: ME_EQUIPMENT_me_equipmentList_limit | null;
  active: boolean | null;
  createdAt: string;
}

export interface ME_EQUIPMENT_me {
  id: string;
  equipmentList: ME_EQUIPMENT_me_equipmentList[];
}

export interface ME_EQUIPMENT {
  me: ME_EQUIPMENT_me;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FeedPageComment
// ====================================================

export interface FeedPageComment_author {
  id: string;
  profilePictureURL: string | null;
  first: string;
  last: string;
  username: string;
}

export interface FeedPageComment_likeList_user {
  id: string;
}

export interface FeedPageComment_likeList {
  user: FeedPageComment_likeList_user;
}

export interface FeedPageComment {
  id: string;
  note: string;
  author: FeedPageComment_author;
  likeList: FeedPageComment_likeList[];
  createdAt: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: EquipmentData
// ====================================================

export interface EquipmentData_usage {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface EquipmentData_limit {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface EquipmentData {
  id: string;
  name: string;
  type: AllowedEquipment;
  usage: EquipmentData_usage | null;
  limit: EquipmentData_limit | null;
  active: boolean | null;
  createdAt: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FeedPagePost
// ====================================================

export interface FeedPagePost_author {
  id: string;
  username: string;
  first: string;
  last: string;
  profilePictureURL: string | null;
}

export interface FeedPagePost_activityList_distance {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface FeedPagePost_activityList_equipment_usage {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface FeedPagePost_activityList_equipment_limit {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface FeedPagePost_activityList_equipment {
  id: string;
  name: string;
  type: AllowedEquipment;
  usage: FeedPagePost_activityList_equipment_usage | null;
  limit: FeedPagePost_activityList_equipment_limit | null;
  active: boolean | null;
  createdAt: string;
}

export interface FeedPagePost_activityList_additionalInfo {
  averageHeartRate: number | null;
  elevationGain: number | null;
  calories: number | null;
}

export interface FeedPagePost_activityList {
  id: string;
  type: AllowedActivity;
  duration: number | null;
  distance: FeedPagePost_activityList_distance | null;
  equipment: FeedPagePost_activityList_equipment | null;
  additionalInfo: FeedPagePost_activityList_additionalInfo | null;
}

export interface FeedPagePost_likeList_user {
  id: string;
}

export interface FeedPagePost_likeList {
  user: FeedPagePost_likeList_user;
}

export interface FeedPagePost_commentList_author {
  id: string;
  profilePictureURL: string | null;
  first: string;
  last: string;
  username: string;
}

export interface FeedPagePost_commentList_likeList_user {
  id: string;
}

export interface FeedPagePost_commentList_likeList {
  user: FeedPagePost_commentList_likeList_user;
}

export interface FeedPagePost_commentList {
  id: string;
  note: string;
  author: FeedPagePost_commentList_author;
  likeList: FeedPagePost_commentList_likeList[];
  createdAt: string;
}

export interface FeedPagePost {
  id: string;
  title: string;
  note: string | null;
  postDate: string;
  author: FeedPagePost_author;
  activityList: FeedPagePost_activityList[];
  likeList: FeedPagePost_likeList[];
  commentList: FeedPagePost_commentList[];
  createdAt: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TeamData
// ====================================================

export interface TeamData_owner {
  id: string;
}

export interface TeamData {
  id: string;
  name: string;
  private: boolean | null;
  description: string | null;
  profilePictureURL: string | null;
  memberCount: number;
  owner: TeamData_owner;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProfileData
// ====================================================

export interface ProfileData_followerList {
  id: string;
}

export interface ProfileData_followingList {
  id: string;
}

export interface ProfileData_equipmentList_usage {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface ProfileData_equipmentList_limit {
  value: number | null;
  unit: AllowedUnit | null;
}

export interface ProfileData_equipmentList {
  id: string;
  name: string;
  type: AllowedEquipment;
  usage: ProfileData_equipmentList_usage | null;
  limit: ProfileData_equipmentList_limit | null;
  active: boolean | null;
  createdAt: string;
}

export interface ProfileData_teamList_owner {
  id: string;
}

export interface ProfileData_teamList {
  id: string;
  name: string;
  private: boolean | null;
  description: string | null;
  profilePictureURL: string | null;
  memberCount: number;
  owner: ProfileData_teamList_owner;
}

export interface ProfileData {
  id: string;
  email: string;
  first: string;
  last: string;
  username: string;
  profilePictureURL: string | null;
  birthdate: string | null;
  bio: string | null;
  private: boolean;
  createdAt: string;
  followerList: ProfileData_followerList[];
  followingList: ProfileData_followingList[];
  equipmentList: ProfileData_equipmentList[];
  teamList: ProfileData_teamList[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: NotificationData
// ====================================================

export interface NotificationData_sender {
  id: string;
  username: string;
  first: string;
  last: string;
  profilePictureURL: string | null;
}

export interface NotificationData_team {
  id: string;
  name: string;
  profilePictureURL: string | null;
}

export interface NotificationData_post {
  id: string;
  title: string;
}

export interface NotificationData_comment {
  id: string;
  note: string;
}

export interface NotificationData {
  id: string;
  sender: NotificationData_sender | null;
  team: NotificationData_team | null;
  message: string;
  responseRequired: boolean | null;
  type: AllowedNotification;
  read: boolean;
  post: NotificationData_post | null;
  comment: NotificationData_comment | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum AllowedEquipment {
  BIKE = "BIKE",
  SHOE = "SHOE",
}

export enum AllowedUnit {
  KM = "KM",
  M = "M",
  MI = "MI",
  YDS = "YDS",
}

export enum AllowedActivity {
  ALTERG = "ALTERG",
  AQUA_JOG = "AQUA_JOG",
  BIKE = "BIKE",
  CLIMB = "CLIMB",
  HIKE = "HIKE",
  LIFT = "LIFT",
  RUN = "RUN",
  SLEEP = "SLEEP",
  SWIM = "SWIM",
  WALK = "WALK",
  YOGA = "YOGA",
}

export enum AllowedNotification {
  COMMENT = "COMMENT",
  FOLLOW = "FOLLOW",
  FOLLOW_ACCEPT = "FOLLOW_ACCEPT",
  FOLLOW_REQUEST = "FOLLOW_REQUEST",
  LIKE_COMMENT = "LIKE_COMMENT",
  LIKE_POST = "LIKE_POST",
  MENTIONED_POST = "MENTIONED_POST",
  POST_NOTIFICATION = "POST_NOTIFICATION",
  TEAM_ACCEPT = "TEAM_ACCEPT",
  TEAM_INVITE = "TEAM_INVITE",
  TEAM_JOINED = "TEAM_JOINED",
  TEAM_REQUEST = "TEAM_REQUEST",
}

// null
export interface UpdatePostInput {
  postId: string;
  title?: string | null;
  note?: string | null;
  activityList: UpdatePostActivityInput[];
  tagIdList: string[];
}

// null
export interface UpdatePostActivityInput {
  activityId?: string | null;
  type: AllowedActivity;
  duration?: number | null;
  distance?: DistanceInput | null;
  equipmentId?: string | null;
  additionalInfo?: AdditionalInfoInput | null;
}

// null
export interface DistanceInput {
  value: number;
  unit: AllowedUnit;
}

// null
export interface AdditionalInfoInput {
  averageHeartRate?: number | null;
  elevationGain?: number | null;
  calories?: number | null;
}

// null
export interface CreatePostInput {
  title: string;
  note?: string | null;
  activityList: CreateActivityInput[];
  tagIdList: string[];
  postDate: string;
}

// null
export interface CreateActivityInput {
  type: AllowedActivity;
  duration?: number | null;
  distance?: DistanceInput | null;
  equipmentId?: string | null;
  additionalInfo?: AdditionalInfoInput | null;
}

// null
export interface CreateTeamInput {
  name: string;
  description?: string | null;
  file?: any | null;
  private?: boolean | null;
}

// null
export interface UpdateTeamInput {
  teamId: string;
  name?: string | null;
  description?: string | null;
  profilePictureURL?: string | null;
  file?: any | null;
  ownerId?: string | null;
  private?: boolean | null;
}

// null
export interface UpdateUserInput {
  username?: string | null;
  first?: string | null;
  last?: string | null;
  profilePictureURL?: string | null;
  file?: any | null;
  birthdate?: string | null;
  bio?: string | null;
  private?: boolean | null;
}

// null
export interface UpdateEquipmentInput {
  equipmentId: string;
  name?: string | null;
  type?: AllowedEquipment | null;
  usage?: DistanceInput | null;
  limit?: DistanceInput | null;
  active?: boolean | null;
}

// null
export interface CreateEquipmentInput {
  name: string;
  type: AllowedEquipment;
  limit: DistanceInput;
}

// null
export interface UpdateNotificationInput {
  id: string;
  read?: boolean | null;
  deleted?: boolean | null;
  accept?: boolean | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================