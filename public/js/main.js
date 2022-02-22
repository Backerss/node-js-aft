

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null) {
       return null;
    }
      return decodeURI(results[1]) || 0;
}

    var rank_id = $.urlParam('ranks_id');

    if(rank_id != null)
    {
      $.ajax({

        url: "admin/getranks/"+rank_id,
        type: "GET",
        dataType: 'json',

        success: function(result)
        {
          $("#edit-ranks-id").val(result.data.ranks_id);
          $("#edit-ranks-name").val(result.data.ranks_name);
          $("#modal-edit").modal('show');
        }
      });
    }



function getuser() {
  var value;

  $.ajax({
    url: "admin/getuser",
    type: "GET",
    dataType: "json",

    success: function (result) {
      $("#user_all").html(`${result.count} ราย`);
    },
  });
}

function getpost() {
  var value;

  $.ajax({
    url: "admin/getpost",
    type: "GET",
    dataType: "json",

    success: function (result) {
      $("#post_all").html(`${result.count} โพสต์`);
    },
  });
}

function getranks() {
  $.ajax({
    url: "admin/getranks",
    type: "GET",
    dataType: "json",

    success: function (result) {
      for (let i = 0; i < result.count; i++) {
        $("#ranks_all").append(`

                  <tr>
                    <td>${result.data[i].ranks_id}</td>
                    <td>${result.data[i].ranks_name}</td>
                    <td>
                      <a href="?ranks_id=${result.data[i].ranks_id}" id="ranks_id=${result.data[i].ranks_id}" class="btn btn-warning btn-sm">แก้ไข</a>
                    </td>
                    <td>
                      <a href="admin/delrank?del_id=${result.data[i].ranks_id}" id="ranks_id=${result.data[i].ranks_id}" class="btn btn-danger btn-sm">ลบ</a>
                    </td>
                  </tr>
                
                `);
      }
    },
  });
}


function getgroup() {
  $.ajax({
    url: "admin/getranks",
    type: "GET",
    dataType: "json",

    success: function (result) {

      console.log(result.data);
      for (let i = 0; i < result.count; i++) {
        $("#rank-group").append(`
          <option value="${result.data[i].ranks_id}">${result.data[i].ranks_name}</option>
        `);
      }
    },
  });
}

getgroup();
getuser();
getpost();
getranks();

$(document).ready(function(){
    $('#btn-submit-edit-rank').click(function(e){
        e.preventDefault();
        var ranks_name = $('#edit-ranks-name').val();
        var ranks_id = $('#edit-ranks-id').val();
        
        
        var data = {};

        data.ranks_id = ranks_id;
        data.ranks_name = ranks_name;

        console.log(data);
        $.ajax({
            url: "admin/edit-rank",
            type: "POST",
            dataType: 'json',
            data: data,
            success: function(result){
                if(result.status == 'success'){
                    getranks();
                }
            },
        });

        $("#modal-edit").modal('hide');
        $("#ranks_all").html('');
        getranks();

        window.history.pushState("", "", window.location.pathname);

    });
});


$(document).ready(function(){

  $('#add-ranks-name').click(function(e){


    $('#add-ranks-name').css('border-color','#ccc');

  });
});

$(document).ready(function(){
    $('#add-ranks-submit').click(function(e){
      e.preventDefault();
      var ranks_name = $('#add-ranks-name').val();

      if(ranks_name == "")
      {
        $('#add-ranks-name').css('border-color', 'red');
        Swal.fire({
          title: 'Error!',
          text: 'กรุณากรอกชื่อยศหรือต่ำแหน่ง',
          icon: 'error',
          confirmButtonText: 'Ok'
        })
        return;
      }
      if(ranks_name.length < 2)
      {
        $('#add-ranks-name').css('border-color', 'red');
        Swal.fire({
          title: 'Error!',
          text: 'กรุณากรอกชื่อยศหรือต่ำแหน่งให้ครบ',
          icon: 'error',
          confirmButtonText: 'Ok'
        })
        return;
      }
      var data = {};
      data.ranks_name = ranks_name;

      $.ajax({
        url: "admin/add-rank",
        type: "POST",
        dataType: 'json',
        data: data,
        success: function(result){
          if(result.status == 'success'){
            getranks();
          }
        }
      });

      Swal.fire({
        title: 'สำเร็จ!',
        text: 'เพิ่มยศหรือต่ำแหน่งเรียบร้อย',
        icon: 'success',
        confirmButtonText: 'Ok'
      })

      $("#ranks_all").html('');
        getranks();

        window.history.pushState("", "", window.location.pathname);

    });
});


$(document).ready(function(){
  $('#add-user-submit').click(function(e){
    e.preventDefault();
    
    var firstname = $('#firstname').val();
    var lastname = $('#lastname').val();
    var email = $('#email').val();
    var postion = $('#postion').val();


    if(firstname == "" || lastname == "" || email == "" || postion == "")
    {
      Swal.fire({
        title: 'Error!',
        text: 'กรุณากรอกข้อมูลให้ครบ',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    }//else if email not @ .com
    else if(email.indexOf('@gmail.com') == -1 || email.indexOf('.') == -1)
    {
      Swal.fire({
        title: 'Error!',
        text: 'กรุณากรอกอีเมลให้ถูกต้อง',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    }else if(postion.length < 5)
    {
      Swal.fire({
        title: 'Error!',
        text: 'กรุณากรอกตำแหน่งให้ครบ',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    }
    else
    {
      var data = {};
      data.firstname = firstname;
      data.lastname = lastname;
      data.email = email;
      data.postion = postion;

      $.ajax({
        url: "admin/check-user",
        type: "POST",
        dataType: 'json',
        data: data,
        success: function(result){
          if(result.status == 'firstname:lastname is exist'){
            Swal.fire({
              title: 'Error!',
              text: 'มีชื่อผู้ใช้อยู่แล้ว',
              icon: 'error',
              confirmButtonText: 'Ok'
            })
          }
          else if(result.status == 'email is exist'){
            Swal.fire({
              title: 'Error!',
              text: 'มีอีเมล์อยู่แล้ว',
              icon: 'error',
              confirmButtonText: 'Ok'
            })
          }else
          {
            Swal.fire({
              title: 'สำเร็จ!',
              text: 'เพิ่มผู้ใช้งานเรียบร้อย',
              icon: 'success',
              confirmButtonText: 'Ok'
            })

            $("#user_all").html('');
              getuser();

              window.history.pushState("", "", window.location.pathname);
          }
        }
      });

    }
  

  });

});