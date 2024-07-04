// import Conversation from "../models/conversation.model.js";
// import Message from "../models/message.model.js";
// import { getReceiverSocketId } from "../socket/socket.js";
// export const sendMessage = async(req,res)=>{
//    //console.log("Message sent", req.params.id); //here id is used as in the url in message.rote.js we have written .id if we write userID then the same should come here
//     try {
//         const {message} = req.body; //getting message from user
//         const {id:receiverId} = req.params; // getting receiver id
//         const senderId = req.user._id; // getting sender id from user._id because we added protectRoute

//         let conversation = await Conversation.findOne({
//             participants:{$all:[senderId,receiverId]},
//         }); //to find converations between two users
//         if(!conversation){
//             conversation = await Conversation.create({
//                 participants:[senderId,receiverId], //here no need to create empty array for messages as it is handled in conversation.model.js where message deafult is []
//             });
//         }
//         const newMessage = new Message({
//                 senderId,
//                 receiverId,
//                 message
//         });
//         if(newMessage)
//             conversation.messages.push(newMessage._id);
//         //this will take time, as first conversation.save will be done and than newMessage.save
//         //await conversation.save();
//         //await newMessage.save();

//         // this would be done in parallel
//         await Promise.all([conversation.save(),newMessage.save()]); 
//         //SOCKET.io will go here
//         const receiverSocketId = getReceiverSocketId(receiverId);
//         if(receiverId){
//             io.to(receiverSocketId).emit("newMessage",newMessage);
//         }

//         res.status(201).json(newMessage);
//     } catch (error) {
//         console.log("Error in send Message Contoller", error.message);
//         res.status(500).json({error:"Internal Server Error"});
//     }
// }

// export const getMessages = async(req,res)=>{
//     try {
//         const {id:userToChatId} = req.params;
//         const senderId = req.user._id; //from protect route method 
//         const converations = await Conversation.findOne({ //find this conversation. Inside the converation we have message id and no message content
//             participants: {$all: [senderId,userToChatId]},
//         }).populate("messages")        //to get every messages from the messages array in converation instead of getting refernce id
//         if(!converations) return res.status(200).json([]);
//         const messages = converations.messages;
//         res.status(200).json(messages);
        
//     } catch (error) {
//             console.log("Error in get Message Contoller", error.message);
//             res.status(500).json({error:"Internal Server Error"});
//         }
// }


import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		// await conversation.save();
		// await newMessage.save();

		// this will run in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

		// SOCKET IO FUNCTIONALITY WILL GO HERE
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};