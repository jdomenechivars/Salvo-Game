package salvo.salvo;

import javafx.scene.effect.Light;
import org.hibernate.boot.jaxb.SourceType;
import org.omg.CORBA.PUBLIC_MEMBER;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.persistence.Entity;
import java.net.SocketPermission;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class SalvoControler {

    @Autowired
    private GameRepository gameRepo;

    @Autowired
    private GamePlayerRepository gamePlRepo;

    @Autowired
    private ScoreRepository scoreRepo;

    @Autowired
    private PlayerRepository playerRepo;

    @Autowired ShipRepository shipRepo;

    // MAIN PAGE JSON //

    @RequestMapping(path = "/games", method = RequestMethod.GET)
    public Map<String, Object> gameInfo (Authentication authentication) {
        Map<String, Object> info = new LinkedHashMap<String, Object>();

        info.put("leaderBoard",returnScores());
        info.put("gamesInfo", returnGames());

        if(authentication != null) {

            Player currentPlayer = getAll(authentication);

            if (currentPlayer != null) {

                info.put("currentUserInfo", returnCurrentPlayerInfo(currentPlayer));

            }
        }
        return info;
    }

    public Player getAll(Authentication authentication) {
        return playerRepo.findByUserName(authentication.getName());
    }

    public Map<String, Object> returnCurrentPlayerInfo (Player player){
        Map<String, Object> current = new LinkedHashMap<>();
        current.put("currentUser", toPlayer(player));
//        current.put("games", );
        return current;
    }

    public List<Object> returnScores(){
        return playerRepo
                .findAll()
                .stream()
                .map(player -> leaderBoardInfo(player))
                .collect(Collectors.toList());
    }

    public Map<String, Object> leaderBoardInfo (Player player){
        Map<String, Object> leadB = new LinkedHashMap<String, Object>();
        leadB.put("playerName", player.getUserName());
//        leadB.put("scores", countScores(player));
        int win = 0;
        int lost = 0;
        int tied = 0;

        for ( Score score : player.getScores() ) {

            if (score.getScore()  == 1) {

                win = win + 1;

            } else if (score.getScore() == 0) {

                lost = lost + 1;

            } else {

                tied = tied + 1;

            }
        }
        leadB.put("win", win);
        leadB.put("lost", lost);
        leadB.put("tied", tied);
        return leadB;
    }

    public List<Object> returnGames() {
        return gameRepo
                .findAll()
                .stream()
                .map(game -> toDTO(game))
                .collect(Collectors.toList());

    }

    public Map<String, Object> toDTO(Game game) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("gameId", game.getId());
        dto.put("gameDate", game.getGameDate());
        dto.put("gamePlayers", game.getGamePlayers()
                .stream()
                .map(gamePlayer -> toGP(gamePlayer))
                .collect(Collectors.toList()));
/*       List ids = game.getGamePlayers()
               .stream()
               .map(gamePlayer -> gamePlayer.getPlayer().getId())
               .collect(Collectors.toList());
       dto.put("ids", ids);*/
        return dto;
    }

    public Map<String, Object> toGP(GamePlayer gamePlayers) {
        Map<String, Object> GP = new LinkedHashMap<String, Object>();
        GP.put("gpId", gamePlayers.getId());
        GP.put("player", toPlayer(gamePlayers.getPlayer()));
        return GP;
    }

    public Map<String, Object> toPlayer(Player player){
        Map<String, Object> TP = new LinkedHashMap<String, Object>();
        TP.put("playerId", player.getId());
        TP.put("username", player.getUserName());
        return TP;
    }

    // CREATE NEW GAME //

    @RequestMapping(path = "/games", method = RequestMethod.POST)
    public Object createGame (Authentication authentication){


        if (authentication == null){

            return new ResponseEntity<>("UNAUTHORIZED USER!", HttpStatus.UNAUTHORIZED);

        }

       Game newGame = new Game();
        gameRepo.save(newGame);

        Player currentPlayer = getAll(authentication);

        GamePlayer newGamePlayer = new GamePlayer(currentPlayer, newGame);
        gamePlRepo.save(newGamePlayer);

        Object gpId = newGamePlayer.getId();

        return new ResponseEntity<>(makeMap("gpId", gpId), HttpStatus.CREATED);
    }

    private Map<String, Object> makeMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }

    // CREATE NEW PLAYER //

    @RequestMapping(path = "/players", method = RequestMethod.POST)
    public ResponseEntity<String> createPlayers (String username, String password){

        if (username.isEmpty()) {
            return new ResponseEntity<>("No name given", HttpStatus.FORBIDDEN);
        }

        Player player = playerRepo.findByUserName(username);
        if (player != null) {
            return new ResponseEntity<>("Name already used", HttpStatus.CONFLICT);
        }

        playerRepo.save(new Player(username, password));
        return new ResponseEntity<>("Named added", HttpStatus.CREATED);

    }

    // EACH GAME JSON //

    @RequestMapping("/game_view/{nn}")
    public Object returnSelectGame(@PathVariable long nn, Authentication authentication) {

        if (authentication == null){

            return new ResponseEntity<>("No Log", HttpStatus.UNAUTHORIZED);

        }

        if (authentication != null){

            String  currentUserName = gamePlRepo.findOne(nn).getPlayer().getUserName();

            if( getAll(authentication).getUserName() != currentUserName){

                return new ResponseEntity<>("UNAUTHORIZED USER!", HttpStatus.FORBIDDEN);

            }
        }

        Map<String, Object> retSG = new LinkedHashMap<String, Object>();

        GamePlayer currentGamePlayer = gamePlRepo.findOne(nn);

        retSG.put("gpId", currentGamePlayer.getId());
        retSG.put("created", currentGamePlayer.getGamePlayerDate());
        retSG.put("gamePlayers",currentGamePlayer.getGame().getGamePlayers()
                .stream()
                .map(gamePlayer -> toGP(gamePlayer))
                .collect(Collectors.toList()));
        retSG.put("ships", currentGamePlayer.getShips()
                .stream()
                .map(ships -> toBoat(ships))
                .collect(Collectors.toList()));
        retSG.put("salvoes", currentGamePlayer.getGame().getGamePlayers()
                .stream()
                .map(gamePlayer -> toSalvo(gamePlayer))
                .collect(Collectors.toList()));
        return retSG;
    }

    public Map<String, Object> toBoat(Ship ships){
        Map<String, Object> boat = new LinkedHashMap<String, Object>();
        boat.put("type",ships.getType());
        boat.put("locations",ships.getLocations());
        return boat;
    }

    public List<Map<String, Object>> toSalvo(GamePlayer gamePlayer){

        return gamePlayer.getSalvos()
                            .stream()
                            .map(salvo -> salvoToJson(salvo))
                            .collect(Collectors.toList());
    }

    private Map<String, Object> salvoToJson(Salvo salvo) {
        Map<String, Object> eachSalvo = new LinkedHashMap<>();
        eachSalvo.put("turn", salvo.getTurn());
        eachSalvo.put("gpId", salvo.getGamePlayer().getId());
        eachSalvo.put("playerId", salvo.getGamePlayer().getPlayer().getId());
        eachSalvo.put("salvoLocations", salvo.getSalvoLocations());

        return eachSalvo;
    }

    // JOIN A STARTED GAME //

    @RequestMapping(path = "/game/{nn}/players", method = RequestMethod.POST)
    public Object joinSelectedGame(@PathVariable long nn, Authentication authentication){


        if (authentication == null){

            return new ResponseEntity<>("UNAUTHORIZED USER!", HttpStatus.UNAUTHORIZED);

        }

        Player currentPlayer = getAll(authentication);

        Game currentGame = gameRepo.findOne(nn);

        if(currentGame.getGamePlayers().size() == 1){

            GamePlayer newGamePlayer = new GamePlayer(currentPlayer, currentGame);
            gamePlRepo.save(newGamePlayer);

            Object gpId = newGamePlayer.getId();

            return new ResponseEntity<>(makeMap("gpId", gpId), HttpStatus.CREATED);

        }

        return new ResponseEntity<>("GAME NOT AVAILABLE, REFRESH!", HttpStatus.FORBIDDEN);

    }

    // SHIPS PLACEMENT //

    @RequestMapping(path = "/games/players/{nn}/ships", method = RequestMethod.POST)
    public Object placingShips(@PathVariable long nn, Authentication authentication, @RequestBody Set<Ship> ships ) {

        if (authentication == null ){

            return new ResponseEntity<>("UNAUTHORIZED USER!", HttpStatus.UNAUTHORIZED);

        }

        Player currentPlayer = getAll(authentication);

        GamePlayer currentGP = gamePlRepo.findOne(nn);

        if( currentGP.getPlayer().getId() != currentPlayer.getId()){

            return new ResponseEntity<>("UNAUTHORIZED USER!", HttpStatus.UNAUTHORIZED);

        }

        for (Ship ship : ships) {

            currentGP.addShip(ship);
            shipRepo.save(ship);
        }

        return new ResponseEntity<>("", HttpStatus.CREATED);


    }


}