package salvo.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class SalvoControler {

    @Autowired
    private GameRepository gameRepo;

    @RequestMapping("/games")
    public List<Object> returnGames() {
        return gameRepo
                .findAll()
                .stream()
                .map(game -> toDTO(game))
                .collect(Collectors.toList());

    }

    public Map<String, Object> toDTO(Game game) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", game.getId());
        dto.put("date", game.getGameDate());
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
        GP.put("id", gamePlayers.getId());
        GP.put("player", toPlayer(gamePlayers));
        return GP;
    }

    public Map<String, Object> toPlayer(GamePlayer gamePlayer){
        Map<String, Object> TP = new LinkedHashMap<String, Object>();
        TP.put("id", gamePlayer.getPlayer().getId());
        TP.put("email", gamePlayer.getPlayer().getUserName());
        return TP;
    }
}




