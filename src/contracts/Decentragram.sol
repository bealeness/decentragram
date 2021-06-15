pragma solidity ^0.5.0;

contract Decentragram {
  string public name = "Decentragram";

  //store images
  uint public imageCount = 0;
  mapping(uint => Image) public images;

  struct Image {
    uint id;
    string hashcode;
    string description;
    uint tipAmount;
    address payable author;
  }

  event ImageCreated (
    uint id,
    string hashcode,
    string description,
    uint tipAmount,
    address payable author
  );

  event ImageTipped (
    uint id,
    string hashcode,
    string description,
    uint tipAmount,
    address payable author
  );

  //create images
  function uploadImages(string memory _ImgHash, string memory _description) public {

    //make sure image hash exists
    require(bytes(_ImgHash).length > 0);

    //make sure image description exists
    require(bytes(_description).length > 0);

    //make sure author is not blank
    require(msg.sender != address(0x0));

    //increment image ID
    imageCount ++;

    //add image to contract
    images[imageCount] = Image(imageCount, _ImgHash, _description, 0, msg.sender);

    //trigger an event
    emit ImageCreated(imageCount, _ImgHash, _description, 0, msg.sender);
  }

  //tip images

  function tipImageOwner(uint _id) public payable {

    //make sure the id is valid
    require(_id > 0 && _id <= imageCount);

    //fetch the image
    Image memory _image = images[_id];

    //fetch the author
    address payable _author = _image.author;

    //tip the author
    address(_author).transfer(msg.value);

    //increment the tip amount stored in struct
    _image.tipAmount = _image.tipAmount + msg.value;

    //update the image, put back into the struct
    images[_id] = _image;

    //trigger an event
    emit ImageTipped(_id, _image.hashcode, _image.description, _image.tipAmount, _author);
    
  }

}
