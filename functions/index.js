const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp();


exports.onCreateFollower = functions.firestore
    .document("/followers/{userId}/userFollowers/{followerId}")
    .onCreate(async(snapshot, context) => {

        console.log("follower created ", snapshot.data());
        const userId = context.params.userId;
        const followerId = context.params.followerId;

        // 1) Get followed user posts
        const followedUserPostRef = admin
            .firestore()
            .collection("posts")
            .doc(userId)
            .collection('userPosts');

        // 2) following user's timeline
        const timelinePostRef = admin
            .firestore()
            .collection('timeline')
            .doc(followerId)
            .collection("timelinePosts");

        // 3) get followed users posts
        const querySnapshot = await followedUserPostRef.get()

        // 4 add each user post to following user's timeline
        querySnapshot.forEach(doc => {
            if (doc.exists) {
                const postId = doc.id
                const postData = doc.data()
                timelinePostRef.doc(postId).set(postData);
            }
        })

    });


exports.onDeleteFollower = functions.firestore
    .document("/followers/{userId}/userFollowers/{followerId}")
    .onDelete(async(snapshot, context) => {
        const userId = context.params.userId
        const followerId = context.params.followerId;

        const timelinePostRef = admin
            .firestore()
            .collection("timeline")
            .doc(followerId)
            .collection("timelinePosts")
            .where("userID", "==", userId);

        const querySnapshot = await timelinePostRef.get();

        querySnapshot.forEach(doc => {
            if (doc.exists) {
                doc.ref.delete()
            }
        })
    })

exports.onCreatePost = functions.firestore
    .document('posts/{userId}/userPosts/{postId}')
    .onCreate(async(snapshot, context) => {
        const postCreated = snapshot.data();
        const userId = context.params.userId;
        const postId = context.params.postId;

        const userFollowersRef = admin.firestore()
            .collection('followers')
            .doc(userId)
            .collection('userFollowers')

        const notiData = {
            userID: userId,
            subject: postCreated.name,
            body: postCreated.message,
            created: postCreated.created,
            postOwner: postCreated.userID,
            notificationType: postCreated.notificationType,
            isRead: 'false',
            seen: 'false',
            postID: postId
        }
        const querySnapshot = await userFollowersRef.get()
        querySnapshot.forEach(doc => {
            const followersId = doc.id
            admin
                .firestore()
                .collection("timeline")
                .doc(followersId)
                .collection('timelinePosts')
                .doc(postId)
                .set(postCreated)

            admin
                .firestore()
                .collection("timeline")
                .doc(followersId)
                .collection('timelinePosts')
                .doc(postId)
                .set(postCreated)

            admin
                .firestore()
                .collection("notifications")
                .doc(followersId)
                .collection('userNotifications')
                .add(notiData)

        })


    })

exports.onDeletePost = functions.firestore
    .document('posts/{userId}/userPosts/{postId}')
    .onDelete(async(snapshot, context) => {
        const postCreated = snapshot.data();
        const userId = context.params.userId;
        const postId = context.params.postId;

        const userFollowersRef = admin.firestore()
            .collection('followers')
            .doc(userId)
            .collection('userFollowers')

        const querySnapshot = await userFollowersRef.get()
        querySnapshot.forEach(doc => {
            const followersId = doc.id
            admin
                .firestore()
                .collection("timeline")
                .doc(followersId)
                .collection('timelinePosts')
                .doc(postId)
                .delete()
        })

        admin
            .firestore()
            .collection("timeline")
            .doc(userId)
            .collection('timelinePosts')
            .doc(postId)
            .delete()
    })

exports.onUpdatePost = functions.firestore
    .document('posts/{userId}/userPosts/{postId}')
    .onUpdate(async(change, context) => {
        const postData = change.after.data();
        const userId = context.params.userId;
        const postId = context.params.postId;

        const userFollowersRef = admin.firestore()
            .collection('followers')
            .doc(userId)
            .collection('userFollowers')

        const querySnapshot = await userFollowersRef.get()
        querySnapshot.forEach(doc => {
            const followersId = doc.id
            admin
                .firestore()
                .collection("timeline")
                .doc(followersId)
                .collection('timelinePosts')
                .doc(postId)
                .update(postData)
        })


    })

//This functions are for the old app
exports.onPostFeed = functions.firestore
    .document("/Feeds/{feedId}")
    .onWrite(async(change, context) => {

        let feedId = context.params.feedId
        let data = change.after.data();
        //get Friend users posts

        console.log(context)
        const usersRef = admin
            .firestore()
            .collection('Profile')

        const notificatonRef = admin
            .firestore()
            .collection("notifications")

        const querySnapshot = await usersRef.get();

        querySnapshot.forEach(doc => {
            if (doc.exists) {
                let userID = doc.id;
                if (doc.id !== data.userID) {

                    notiData = {
                        userID: doc.id,
                        subject: data.name,
                        body: data.message,
                        created: data.created,
                        jobOwner: data.userID,
                        notificationType: data.notificationType,
                        isRead: 'false',
                        seen: 'false',
                        postID: feedId
                    }

                    notificatonRef.add(notiData);
                    console.log(data)
                }
            }
        })

    })

exports.onPostJob = functions.firestore
    .document("/Jobs/{jobID}")
    .onWrite(async(change, context) => {

        let jobID = context.params.jobID
        let data = change.after.data();
        //get Friend users posts

        console.log(context)
        const usersRef = admin
            .firestore()
            .collection('Profile')

        const notificatonRef = admin
            .firestore()
            .collection("notifications")

        const querySnapshot = await usersRef.get();

        querySnapshot.forEach(doc => {
            if (doc.exists) {
                let userID = doc.id;
                if (doc.id !== data.userID) {

                    notiData = {
                        userID: doc.id,
                        subject: data.name,
                        body: data.description,
                        created: data.created,
                        jobOwner: data.userID,
                        notificationType: data.notificationType,
                        isRead: 'false',
                        seen: 'false',
                        postID: jobID
                    }

                    notificatonRef.add(notiData);
                    console.log(data)
                }
            }
        })

    })

exports.onPostOpportunity = functions.firestore
    .document("/Opportunities/{OpportunitiesID}")
    .onWrite(async(change, context) => {

        let OpportunitiesID = context.params.OpportunitiesID
        let data = change.after.data();
        //get Friend users posts

        console.log(context)
        const usersRef = admin
            .firestore()
            .collection('Profile')

        const notificatonRef = admin
            .firestore()
            .collection("notifications")

        const querySnapshot = await usersRef.get();

        querySnapshot.forEach(doc => {
            if (doc.exists) {
                let userID = doc.id;
                if (doc.id !== data.userID) {

                    notiData = {
                        userID: doc.id,
                        subject: data.name,
                        body: data.description,
                        created: data.created,
                        jobOwner: data.userID,
                        notificationType: data.notificationType,
                        isRead: 'false',
                        seen: 'false',
                        postID: OpportunitiesID
                    }

                    notificatonRef.add(notiData);
                    console.log(data)
                }
            }
        })

    })