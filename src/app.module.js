import './styles/main.scss';

angular.module('appModo', [])
  .factory('UserData', ['$http', function ($http) {

    const method = 'GET';
    // gmail
    // let apiKey = "s5oAc7rXowdVo3bPOUXMEAqLGUWuPrI09oT3Oupb";
    // hotmail
    const apiKey = "yQMtBN7cG6oUKEj3mlFw1IZnqN4ugMr47yaF1UWW";
    const apiAdress = "https://api.watchmode.com/v1/title/";

    const getAllMachedTitles = (search) => {
      let url = `https://api.watchmode.com/v1/search/?apiKey=${apiKey}&search_field=name&search_value=${search}`;
      return $http({ method, url })
        .then()
        .catch(err => console.log(err));
    };

    const getSelectedTitleData = (id) => {
      let url = `${apiAdress}${id}/details/?apiKey=${apiKey}`;
      return $http({ method, url })
        .then()
        .catch(err => console.log(err));
    };

    const getSeasonsData = (id) => {
      let url = `${apiAdress}${id}/seasons/?apiKey=${apiKey}`;
      return $http({ method, url })
        .then()
        .catch(err => console.log(err));
    };

    const getEpisodesData = (id) => {
      let url = `${apiAdress}${id}/episodes/?apiKey=${apiKey}`;
      return $http({ method, url })
        .then()
        .catch(err => console.log(err));
    };

    return {
      getAllMachedTitles: getAllMachedTitles,
      getSelectedTitleData: getSelectedTitleData,
      getSeasonsData: getSeasonsData,
      getEpisodesData: getEpisodesData,
    };
  }])

  .controller('mainCtrl', ['UserData', '$scope', '$sce', function (UserData, $scope, $sce) {

    $scope.getYear = new Date().getFullYear();

    $scope.searchTitle = function () {
      UserData.getAllMachedTitles($scope.searchValue).then(res => {
        $scope.titleData = null;
        $scope.titleSearchResult = res.data.title_results;
      })
        .catch(err => console.log(err));
    }

    $scope.selectTitle = (titleID) => {
      UserData.getSelectedTitleData(titleID).then(res => {
        $scope.titleData = res.data;
        if (res.data.type !== "movie") {
          return getSeasonsInfo(titleID);
        }
        return $scope.seasonsData = null;
      })
        .catch(err => console.log(err));
    }

    const getSeasonsInfo = (titleID) => {
      UserData.getSeasonsData(titleID).then(res => {
        $scope.seasonsData = res.data;
        return getEpisodesInfo(titleID);
      })
        .catch(err => console.log(err));
    }

    const getEpisodesInfo = (titleID) => {
      UserData.getEpisodesData(titleID).then(res => {
        $scope.episodesData = res.data;
      })
        .catch(err => console.log(err));
    }

    $scope.generateTrustedUrl = (value) => {
      const regEx = /\watch\?v=/;
      const embedLink = value.replace(regEx, 'embed/');
      return $sce.trustAsResourceUrl(embedLink);
    };
  }])
