
export const loadHelpCrunch = () => {
    window.HelpCrunch=function(){window.HelpCrunch.q.push(arguments)};
    window.HelpCrunch.q=[];

    var s=document.createElement('script');
    s.async=1;
    s.type='text/javascript';
    s.src='https://widget.helpcrunch.com/';
    (document.body||document.head).appendChild(s);
    s.id = "hc-script";
    s.onload = () => {
        initHelpCrunch()
    }
};

export const initHelpCrunch = () => {
    window.HelpCrunch('init', 'gohirenow', {
        applicationId: 1,
        applicationSecret: 'nhTZnSb5x2KF+KQuOFHIIrzk5pKyVj3XevjuXiYvjhL9PiBxWSMPtV/CIZo3EMglN/jSg5F4aoj2LTSYd2f56Q=='
    });
    window.HelpCrunch('showChatWidget');
    window.showChatWidget = function (){window.HelpCrunch('showChatWidget')};
    window.HideChatWidget = function (){window.HelpCrunch('hideChatWidget');window.HelpCrunch('logout');window.HelpCrunch('closeChat');};
};
// =======
// // export const loadHelpCrunch = () => {
// //     window.HelpCrunch=function(){window.HelpCrunch.q.push(arguments)};
// //     window.HelpCrunch.q=[];
// //
// //     var s=document.createElement('script');
// //     s.async=1;
// //     s.type='text/javascript';
// //     s.src='https://widget.helpcrunch.com/';
// //     (document.body||document.head).appendChild(s);
// //     s.id = "hc-script";
// //     s.onload = () => {
// //         initHelpCrunch()
// //     }
// // };
// //
// // export const initHelpCrunch = () => {
// //     window.HelpCrunch('init', 'kukharets', {
// //         applicationId: 1,
// //         applicationSecret: 'RdxuuTjM+4kCMzGGpCZChpezDLVNPAFOoemnCcUGn2iclux0usT7zMOspf5MBWxpOOSmnZDLecz2lrDHCxrnJg=='
// //     });
// //     window.HelpCrunch('showChatWidget');
// //     window.showChatWidget = function (){};
// //     window.HideChatWidget = function (){return HelpCrunch('hideChatWidget')};
// // };
// >>>>>>> origin/new-home-template
