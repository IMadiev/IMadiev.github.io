// Распознавание
$(document).ready(function(){
    setTimeout(function(){initMapContour()},500);
});
function initMapContour(){
    //Delayed init, because we have to make sure, that all images are loaded
    $('.contourmap').mapContourEditor({contour:[0, 0]});

    $('#magicStick').click(function(){
        //Set magic stick and change button #magicStick caption
        $('.contourmap').mapContourEditor('setData',{magicStick:1});

        if($('.contourmap').mapContourEditor('getData','magicStick')==1){
            $('#magicStick').attr('value','Disable magic stick');
        } else {
            $('#magicStick').attr('value','Enable magic stick');
        }
    });
    $('#getCoords').click(function(){
        //Get current contour coordinates
        $('#coord_data').html($('.contourmap').mapContourEditor('getData','contour').join());
    });

    $('.contourmap').on('magicStickChange',function(){
        //if event magicStickChange has occured - change button #magickStick caption
        if($('.contourmap').mapContourEditor('getData','magicStick')==1){
            $('#magicStick').attr('value','Disable magic stick');
        } else {
            $('#magicStick').attr('value','Enable magic stick');
        }
    });

    $('#getCoords').click(function(){
        //Get current contour coordinates
        $('#coord_data').html($('.contourmap').mapContourEditor('getData','contour').join());
    });

    $('#destroy').click(function(){
        $('.contourmap').mapContourEditor('destroy');
    });
}