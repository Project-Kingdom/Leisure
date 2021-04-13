var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/Leisure', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
var conn=mongoose.Collection;
var customerSchema=new mongoose.Schema({
    username: {type:String, 
        required: true,
        index: {
            unique: true,        
        }},

	email: {
        type:String, 
        required: true,
        index: {
            unique: true, 
        },
     //match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type:String, 
        required: true
    },
    date:{
        type: Date, 
        default: Date.now }
});
var customerModel=mongoose.model('Customer_detail',customerSchema);
module.exports=customerModel;